/**
 * Build styles
 */
import './index.css';
import {IconUnderline} from '@codexteam/icons'
import {type API, type InlineTool, type SanitizerConfig} from "@editorjs/editorjs";
import {type InlineToolConstructorOptions} from "@editorjs/editorjs/types/tools/inline-tool";

/**
 * Underline Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
export default class Underline implements InlineTool {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS(): string {
    return 'cdx-underline';
  };

  /**
   * Toolbar Button
   *
   * @type {HTMLButtonElement}
   */
  private button: HTMLButtonElement | undefined

  /**
   * Tag represented the term
   *
   * @type {string}
   */
  private tag: string = 'U';

  /**
   * API InlineToolConstructorOptions
   *
   * @type {API}
   */
  private api: API

  /**
   * CSS classes
   *
   * @type {object}
   */
  private iconClasses: {base: string, active: string}

  /**
   * @param options InlineToolConstructorOptions
   */
  public constructor(options: InlineToolConstructorOptions) {
    this.api = options.api;

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Create button element for Toolbar
   *
   * @returns {HTMLElement}
   */
  public render(): HTMLElement {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  public surround(range: Range): void {
    if (!range) {
      return;
    }

    const termWrapper = this.api.selection.findParentTag(this.tag, Underline.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  public wrap(range: Range) {
    /**
     * Create a wrapper for highlighting
     */
    const u = document.createElement(this.tag);

    u.classList.add(Underline.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    u.appendChild(range.extractContents());
    range.insertNode(u);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(u);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  public unwrap(termWrapper: HTMLElement): void {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    if (!sel) {
      return;
    }
    const range = sel.getRangeAt(0);
    if (!range) {
      return
    }

    const unwrappedContent = range.extractContents();
    if (!unwrappedContent) {
      return
    }

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode?.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  public checkState(): boolean {
    const termTag = this.api.selection.findParentTag(this.tag, Underline.CSS);

    this.button?.classList.toggle(this.iconClasses.active, !!termTag);

    return !!termTag
  }

  /**
   * Get Tool icon's SVG
   *
   * @returns {string}
   */
  public get toolboxIcon(): string {
    return IconUnderline;
  }

  /**
   * Sanitizer rule
   *
   * @returns {{u: {class: string}}}
   */
  public static get sanitize(): SanitizerConfig {
    return {
      u: {
        class: Underline.CSS,
      },
    };
  }
}
