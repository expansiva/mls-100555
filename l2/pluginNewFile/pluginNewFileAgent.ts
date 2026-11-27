/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileAgent.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { getMessageKey } from "/_102029_/l2/collabLitElement.js";
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { IDetails, createNewFile, changeFolder, changeProject, changeShortName, getTemplateImport } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";
import { ServiceBase } from '/_102027_/l2/serviceBase.js';

import '/_100555_/l2/pluginNewFile/widgetTextCode.js';
/// **collab_i18n_start**
const message_pt = {
    title: "Agente",
    desc: "Criar um novo arquivo do tipo agente.",
    header: "Novo agente",
    subtitle: "Arquivo de agente de IA, a partir de um dos modelos abaixo.",
    template: "Modelo",
    btnCreate: "Criar agente",
    project: "Projeto",
    shortName: "Nome",
    folder: "Pasta",
    rootFolder: "(raiz)",
    willCreate: "Será criado",
    preview: "Prévia do código",
    loading: "Criando arquivo...",
    emptyName: "Digite um nome para o arquivo",
    error: "Nome do arquivo agente em branco ou inválido",
}

const message_en = {
    title: "Agent",
    desc: "Create a new agent file.",
    header: "New agent",
    subtitle: "AI agent file, based on one of the templates below.",
    template: "Template",
    btnCreate: "Create agent",
    project: "Project",
    shortName: "Name",
    folder: "Folder",
    rootFolder: "(root)",
    willCreate: "Will be created",
    preview: "Code preview",
    loading: "Creating file...",
    emptyName: "Type a name for the file",
    error: "Blank or invalid agent file name",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'en': message_en,
  'pt': message_pt
}
/// **collab_i18n_end**

const lang = getMessageKey(messages);
let msg: MessageType = messages[lang];

export const details: IDetails = {
  title: msg.title,
  description: msg.desc,
  tags: ["agent", "ai", "artificial intelligence"],
}

@customElement('plugin-new-file--plugin-new-file-agent-100555')
export class PluginNewFileBlank extends StateLitElement {

  @propertyDataSource() shortName: string | undefined;

  @propertyDataSource() folder: string | undefined;

  @propertyDataSource({ attribute: true }) project: number | undefined;

  @property() position: 'left' | 'right' = 'left';

  @property() loading: boolean = false;


  @state() private codeTab: number = 0;

  @property() templateType: AgentTemplateType = 'agent';

  private service = this.closest('service-detail-100554') as ServiceBase;

  private enhancement: string = `_100554_/l2/enhancementAgent.ts`;

  private getTemplate(): string {

    const folder = this.folder ? `${this.folder}` : '';
    const name = `_${this.project}_/l2/${folder}/${this.shortName}.ts`;
    const template = templates[this.templateType];

    let newExample = template;
    if (this.shortName && this.project) {
      newExample = changeFolder(newExample, folder);
      newExample = changeShortName(newExample, this.shortName);
      newExample = changeProject(newExample, this.project);
    }

    return `/// <mls fileReference="${name}" enhancement="${this.enhancement}"/>\n${newExample}\n`
  }

  private async handleAddFile() {
    if (!this.project || !this.shortName) {
      this.service.setError(msg.error)
      return;
    };
    this.loading = true;
    try {
      await createNewFile({
        project: this.project,
        position: this.position,
        shortName: this.shortName,
        folder: this.folder,
        enhancement: this.enhancement,
        sourceTS: this.getTemplate(),
        sourceHTML: templateHtml,
        openPreview: true
      });
    } catch (e: any) {
      this.loading = false;
    }
  }

    render() {
        const hasName = !!(this.shortName && this.project);
        const folder = this.folder ? `${this.folder}/` : '';
        const filePath = hasName ? `_${this.project}_/l2/${folder}${this.shortName}.ts` : '';

        return html`
            <div class="nf-card">
                <div class="nf-head">
                    <div class="nf-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/></svg>
                    </div>
                    <div class="nf-head-text">
                        <h2>${msg.header}</h2>
                        <p>${msg.subtitle}</p>
                    </div>
                </div>

                <div class="nf-field">
                    <div class="nf-summary-label">${msg.template}</div>
                    <div class="nf-options" role="radiogroup">
                        ${agentTemplateOptions.map((opt) => html`
                            <button role="radio" aria-checked="${this.templateType === opt.value}" class="${this.templateType === opt.value ? 'active' : ''}" @click=${() => this.templateType = opt.value}>${opt.label}</button>
                        `)}
                    </div>
                </div>

                <div class="nf-summary">
                    <div class="nf-summary-label">${msg.willCreate}</div>
                    ${hasName ? html`
                        <code class="nf-path">${filePath}</code>
                    ` : html`<div class="nf-hint">${msg.emptyName}</div>`}
                    <dl class="nf-meta">
                        <div><dt>${msg.project}</dt><dd>${this.project ?? '-'}</dd></div>
                        <div><dt>${msg.folder}</dt><dd>${this.folder || msg.rootFolder}</dd></div>
                        <div><dt>${msg.shortName}</dt><dd>${this.shortName || '-'}</dd></div>
                    </dl>
                </div>

                <button class="nf-create" ?disabled=${!hasName || this.loading} @click=${this.handleAddFile}>
                    ${this.loading ? html`<span class="nf-spinner"></span>${msg.loading}` : msg.btnCreate}
                </button>

                <div class="nf-code">
                    <div class="nf-code-head">
                        <span>${msg.preview}</span>
                        <div class="nf-tabs" role="tablist">
                            <button role="tab" aria-selected="${this.codeTab === 0}" class="${this.codeTab === 0 ? 'active' : ''}" @click=${() => this.codeTab = 0}>TS</button>
                            <button role="tab" aria-selected="${this.codeTab === 1}" class="${this.codeTab === 1 ? 'active' : ''}" @click=${() => this.codeTab = 1}>HTML</button>
                        </div>
                    </div>
                    <plugin-new-file--widget-text-code-100555 ?hidden=${this.codeTab !== 0} language="typescript" text="${this.getTemplate()}"></plugin-new-file--widget-text-code-100555>
                    <plugin-new-file--widget-text-code-100555 ?hidden=${this.codeTab !== 1} language="html" text="${templateHtml}"></plugin-new-file--widget-text-code-100555>
                </div>
            </div>
        `
    }

}

const templates: Record<AgentTemplateType, string> = {

  agent: `
import { IAgentAsync, IAgentMeta } from '${getTemplateImport(102027,'aiAgentBase', '')}';

export function createAgent(): IAgentAsync {
    return {
        agentName: "[shortName]",
        agentProject: [project],
        agentFolder: "[folder]",
        agentDescription: "New agent",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system1,
            }, {
                type: "human",
                content: context.message.content
            }],
            taskTitle: \`Test 1\`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
        }
    };
    return [addMessageAI];

}


async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {


    if (!agent || !context || !step) throw new Error(\`[afterPromptStep] invalid params, agent:\${!!agent}, context:\${!!context}, step:\${!!step}\`);

    const payload = (step.interaction?.payload?.[0]);
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(\`[afterPromptStep] invalid payload: \${payload}\`)
    let status: mls.msg.AIStepStatus = 'completed';
    let intents: mls.msg.AgentIntent[] = [];

    const output = payload.result;
    intents = await processOutput(context, output);

    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };

    return [...intents, updateStatus];

}

async function processOutput(context: mls.msg.ExecutionContext, output: any ): Promise<mls.msg.AgentIntent[]>{

    // Do something with output

    return [];
}


const system1 = \`
<!-- modelType: code-->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

Your instructions here


## Output format
You must return the object strictly as JSON
[[OutputSection]]

\`

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: any;
  }
//#endregion 

    `,

  agentParallel: `
import { IAgentAsync, IAgentMeta } from '${getTemplateImport(102027,'aiAgentBase', '')}';

export function createAgent(): IAgentAsync {
  return {
    agentName: "[shortName]",
    agentProject: [project],
    agentFolder: "[folder]",
    agentDescription: "new agent",
    visibility: "public",
    beforePromptImplicit,
    beforePromptStep,
    afterPromptStep
  };
}

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

 
  const paths: string[] = []; 

  const inputs: mls.msg.IAMessageInputType[] = [{ type: "system", content: system1 }];

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: inputs,
      taskTitle: '',
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: {},
    },
    executionMode: {
      type: 'parallel',
      args: paths
    }
  };
  return [addMessageAI];

}

async function beforePromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  args?: string
): Promise<mls.msg.AgentIntent[]> {
  if (!args) throw new Error(\`[beforePromptStep] args invalid\`)

  // Do something with args if need;
  const humamByArg = args;

  const continueParallel: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: humamByArg
  }
  return [continueParallel];

}

async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
  if (!agent || !context || !step) throw new Error(\`[afterPromptStep] invalid params, agent:\${!!agent}, context:\${!!context}, step:\${!!step}\`);
  const payload = (step.interaction?.payload?.[0]);
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(\`[afterPromptStep] invalid payload: \${payload}\`)
  let status: mls.msg.AIStepStatus = 'completed';
 
  // Process output

  const updateStatus: mls.msg.AgentIntentUpdateStatus = {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep.stepId,
    stepId: step.stepId,
    status
  };
  return [updateStatus];

}

const system1 = \`
<!-- modelType: code-->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

Your instructions here


## Output format
You must return the object strictly as JSON
[[OutputSection]]

\`

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: any;
  }
//#endregion 

`,

  agentWithClarification: `
import { IAgentAsync, IAgentMeta } from '${getTemplateImport(102027,'aiAgentBase', '')}';
import { finishClarification } from '${getTemplateImport(102027,'aiAgentOrchestration', '')}'; 

export function createAgent(): IAgentAsync {
  return {
    agentName: "[shortName]",
    agentProject: [project],
    agentFolder: "[folder]",
    agentDescription: "new agent",
    visibility: "private",
    beforePromptImplicit,
    beforePromptStep,
    beforeClarificationStep,
    afterPromptStep
  };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system1,
            }, {
                type: "human",
                content: context.message.content
            }],
            taskTitle: \`Test 1\`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
        }
    };
    return [addMessageAI];

}

async function beforePromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  args?: string
): Promise<mls.msg.AgentIntent[]> {

  if (!args) throw new Error(\`(\${agent.agentName})[beforePromptStep] args invalid\`);

  const continueIntent: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: args || '',
    systemPrompt: system1
  }

  return [continueIntent];
}


async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
  if (!agent || !context || !step) throw new Error(\`[afterPromptStep] invalid params, agent:\${!!agent}, context:\${!!context}, step:\${!!step}\`);

  const payload = (step.interaction?.payload?.[0]);
  if (payload?.type !== 'clarification' || !payload.json) throw new Error(\`[afterPromptStep] invalid payload: \${payload}\`)

  return [];

}

async function beforeClarificationStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIClarificationStep,
  hookSequential: number,
  json: any
): Promise<HTMLElement> {

  if (!context.task) throw new Error(\`[beforeClarificationStep] invalid task: undefined\`);
  const intentsToClarification: mls.msg.AgentIntent[] = await processIntentsBeforeClarification(agent, context, parentStep, step, hookSequential, json);

  // await import('yourClarificationWidget.js');
  const clariEl = document.createElement('your-clarification-widget');

  clariEl.addEventListener('clarification-finish', (e: Event) => {
    const { detail } = e as CustomEvent<{ value: unknown; action: "continue" | "cancel" }>;
    const { value, action } = detail;
    const prompt = '';

    finishClarification(
        agent,
        step.stepId,
        parentStep.stepId,
        intentsToClarification,
        context,
        prompt,
        action
    );

    });

  return clariEl;

}

async function processIntentsBeforeClarification(
agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIClarificationStep,
  hookSequential: number,
  clarificationResult: any

): Promise<mls.msg.AgentIntent[]>{

    let status: mls.msg.AIStepStatus = 'completed';

  const updateStatus: mls.msg.AgentIntentUpdateStatus = {
    type: 'update-status',
    hookSequential,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: parentStep.stepId,
    stepId: step.stepId,
    status
  };

  const newStep: mls.msg.AgentIntentAddStep = {
    type: "add-step",
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    parentStepId: 1,
    step:
    {
      type: 'agent',
      stepId: 0,
      interaction: null,
      status: 'waiting_human_input',
      nextSteps: [],
      agentName: "", // agentToCall
      prompt: \`{{clarification}}\`,
      rags: null,
    }
  };

    const intents: mls.msg.AgentIntent[] = [newStep, updateStatus];
    return intents;

}


const system1 = \`
<!-- modelType: code-->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

Your instructions here


## Output format
You must return the object strictly as JSON
[[OutputSection]]

\`

//#region OutputSection
export type Output =
  {
    type: "clarification";
    result: any;
  }
//#endregion 


`
};

const templateHtml = `
<plugin-agent-playground-100554  style="display:none"> <promptcustom type="memory" group="A"> User prompt for test here </promptcustom> </plugin-agent-playground-100554>
`

type AgentTemplateType =
  | 'agent'
  | 'agentParallel'
  | 'agentWithClarification';


const agentTemplateOptions: { value: AgentTemplateType, label: string }[] = [
  { value: 'agent', label: 'Agent' },
  { value: 'agentParallel', label: 'Agent Parallel' },
  { value: 'agentWithClarification', label: 'Agent With Clarification' },
];
