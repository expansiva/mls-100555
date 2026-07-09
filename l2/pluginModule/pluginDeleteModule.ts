/// <mls fileReference="_100555_/l2/pluginModule/pluginDeleteModule.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, TemplateResult } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import { removeModule } from '/_100555_/l2/utils/projectAST.js';
import { removeTokensTheme } from '/_102027_/l2/designSystemBase.js';
import { deleteFile } from '/_102027_/l2/libStor.js' 

/// **collab_i18n_start**
const message_pt = {
  btnDelete: 'Deletar',
  lblConfirm: 'Digite o nome do módulo para confirmar:',
  lblFiles: 'Arquivos a serem deletados:',
  errInvalid: 'Nome do módulo incorreto',
  deletedFeedback: 'Os arquivos foram marcados para deleção e estão prontos para salvar e fazer pull request.'
};

const message_en = {
  btnDelete: 'Delete',
  lblConfirm: 'Type the module name to confirm:',
  lblFiles: 'Files to be deleted:',
  errInvalid: 'Wrong module name',
  deletedFeedback: 'Files have been marked for deletion and are ready to save and create a pull request.'
};
type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
  'pt': message_pt,
  'en': message_en
}
/// **collab_i18n_end**

@customElement('plugin-module--plugin-delete-module-100555')
export class PluginDeleteModule extends CollabLitElement {

  private msg: MessageType = messages['en'];

  @property() moduleName: string = 'travel';
  @property() project: string = '102009';

  @state() filesToDelete: mls.stor.IFileInfo[] = [];
  @state() confirmInput: string = '';
  @state() isDeleting: boolean = false;
  @state() isDeleted: boolean = false;
  @state() feedbackMsg: string = '';

  async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProperties);
    this.filesToDelete = this.getFilesModule();
  }

  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const isValid = this.confirmInput.trim() === this.moduleName;

    if (this.isDeleted) {
      return html`  <div class="plugin-delete-module-container">${this.feedbackMsg ? html`<div class="feedback-msg">${this.feedbackMsg}</div>` : ''}</div>`
    }

    return html`
      <div class="plugin-delete-module-container">

        <label>
          ${this.msg.lblConfirm}
          <input 
            type="text" 
            class=${isValid || this.confirmInput === '' ? '' : 'invalid'}
            .value=${this.confirmInput}
            @input=${(e: Event) => this.confirmInput = (e.target as HTMLInputElement).value}
            placeholder=${this.moduleName}
          />
        </label>
        ${!isValid && this.confirmInput !== '' ? html`
          <div class="error-msg">${this.msg.errInvalid}</div>
        ` : ''}

        <details>
          <summary>${this.msg.lblFiles} (${this.filesToDelete.length})</summary>
          <ul>
            ${this.filesToDelete
        .slice()
        .sort((a, b) => a.shortName.localeCompare(b.shortName))
        .map(file => html`
                <li>${this.getFileKey(file)}</li>
              `)}
          </ul>
        </details>

        ${this.feedbackMsg ? html`<div class="feedback-msg">${this.feedbackMsg}</div>` : ''}
        <button 
          style="${this.isDeleted ? 'display:none': 'display:block'}"
          ?disabled=${!isValid || this.isDeleting}
          @click=${this.handleDelete}>
          ${this.isDeleting ? '...' : this.msg.btnDelete}
        </button>
      </div>
    `;
  }

  private getFilesModule() {
    return Object.values(mls.stor.files).filter(file =>
      file.project === +this.project &&
      (file.folder === this.moduleName || file.folder.split('/').shift() === this.moduleName)
    );
  }

  private getFileKey(file: mls.stor.IFileInfo): string {
    return file.folder
      ? `_${file.project}_${file.folder}/${file.shortName}${file.extension}`
      : `_${file.project}_${file.shortName}${file.extension}`;
  }

  private async handleDelete() {
    if (this.confirmInput.trim() !== this.moduleName) return;

    this.isDeleting = true;
    this.feedbackMsg = '';
    try {
      await this.removeTokensIfNeeded(+this.project, this.moduleName);
      await this.deleteAllFiles(this.filesToDelete);
      await removeModule(+this.project, this.moduleName, true);

      this.filesToDelete = [];
      this.confirmInput = '';
      this.feedbackMsg = this.msg.deletedFeedback;
      this.isDeleted = true;
      
    } catch (err) {
      console.error('Error deleting module:', err);
    } finally {
      this.isDeleting = false;
    }
  }

  private async deleteAllFiles(files: mls.stor.IFileInfo[]) {

    for await (let stor of files) {
      await deleteFile(stor)
    }

  }

  private async removeTokensIfNeeded(project: number, moduleName: string) {
    const shortName = 'designSystem';
    const folder = '';
    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) return;
    await removeTokensTheme(project, moduleName);

  }

}