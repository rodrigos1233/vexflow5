import { Element } from './element.js';
import { Glyphs } from './glyphs.js';
import { StaveModifier, StaveModifierPosition } from './stavemodifier.js';
import { RuntimeError } from './util.js';
const assertIsValidTimeSig = (timeSpec) => {
    const numbers = timeSpec.split('/');
    numbers.forEach((number) => {
        if (/^[0-9+\-()]+$/.test(number) === false) {
            throw new RuntimeError('BadTimeSignature', `Invalid time spec: ${timeSpec}. Must contain valid signatures.`);
        }
    });
};
export class TimeSignature extends StaveModifier {
    static get CATEGORY() {
        return "TimeSignature";
    }
    constructor(timeSpec = '4/4', customPadding = 15, validateArgs = true) {
        super();
        this.topRenderY = 0;
        this.botRenderY = 0;
        this.timeSpec = '4/4';
        this.line = 0;
        this.isNumeric = true;
        this.topStartX = 0;
        this.botStartX = 0;
        this.lineShift = 0;
        this.topText = new Element();
        this.botText = new Element();
        this.validateArgs = validateArgs;
        const padding = customPadding;
        this.topLine = 1;
        this.bottomLine = 3;
        this.setPosition(StaveModifierPosition.BEGIN);
        this.setTimeSig(timeSpec);
        this.setPadding(padding);
    }
    static getTimeSigCode(key, smallSig = false) {
        let code = Glyphs.null;
        switch (key) {
            case 'C':
                code = Glyphs.timeSigCommon;
                break;
            case 'C|':
                code = Glyphs.timeSigCutCommon;
                break;
            case '+':
                code = smallSig ? Glyphs.timeSigPlusSmall : Glyphs.timeSigPlus;
                break;
            case '-':
                code = Glyphs.timeSigMinus;
                break;
            case '(':
                code = smallSig ? Glyphs.timeSigParensLeftSmall : Glyphs.timeSigParensLeft;
                break;
            case ')':
                code = smallSig ? Glyphs.timeSigParensRightSmall : Glyphs.timeSigParensRight;
                break;
            default:
                code = String.fromCodePoint(0xe080 + Number(key[0]));
                break;
        }
        return code;
    }
    makeTimeSignatureGlyph(topDigits, botDigits) {
        let txt = '';
        let topWidth = 0;
        let height = 0;
        for (let i = 0; i < topDigits.length; ++i) {
            const code = TimeSignature.getTimeSigCode(topDigits[i], botDigits.length > 0);
            txt += code;
        }
        this.topText.setText(txt);
        topWidth = this.topText.getWidth();
        height = this.topText.getHeight();
        let botWidth = 0;
        txt = '';
        for (let i = 0; i < botDigits.length; ++i) {
            const code = TimeSignature.getTimeSigCode(botDigits[i], true);
            txt += code;
        }
        this.botText.setText(txt);
        botWidth = this.botText.getWidth();
        height = Math.max(height, this.botText.getHeight());
        this.lineShift = height > 30 ? 0.5 : 0;
        this.width = Math.max(topWidth, botWidth);
        this.topStartX = (this.width - topWidth) / 2.0;
        this.botStartX = (this.width - botWidth) / 2.0;
    }
    setTimeSig(timeSpec) {
        var _a, _b;
        this.timeSpec = timeSpec;
        if (timeSpec === 'C' || timeSpec === 'C|') {
            const code = TimeSignature.getTimeSigCode(timeSpec);
            this.line = 2;
            this.text = code;
            this.isNumeric = false;
        }
        else {
            if (this.validateArgs) {
                assertIsValidTimeSig(timeSpec);
            }
            const parts = timeSpec.split('/');
            this.line = 0;
            this.isNumeric = true;
            this.makeTimeSignatureGlyph((_a = parts[0]) !== null && _a !== void 0 ? _a : '', (_b = parts[1]) !== null && _b !== void 0 ? _b : '');
        }
        return this;
    }
    getTimeSpec() {
        return this.timeSpec;
    }
    getLine() {
        return this.line;
    }
    setLine(line) {
        this.line = line;
    }
    getIsNumeric() {
        return this.isNumeric;
    }
    setIsNumeric(isNumeric) {
        this.isNumeric = isNumeric;
    }
    draw() {
        const stave = this.checkStave();
        const ctx = stave.checkContext();
        this.setRendered();
        const clsAttribute = this.getAttribute('class');
        ctx.openGroup('timesignature' + (clsAttribute ? ' ' + clsAttribute : ''), this.getAttribute('id'));
        this.drawAt(ctx, stave, this.x);
        this.drawPointerRect();
        ctx.closeGroup();
    }
    drawAt(ctx, stave, x) {
        this.setRendered();
        if (this.isNumeric) {
            let startX = x + this.topStartX;
            if (this.botText.getText().length > 0) {
                this.topRenderY = stave.getYForLine(this.topLine - this.lineShift);
            }
            else {
                this.topRenderY = (stave.getYForLine(this.topLine) + stave.getYForLine(this.bottomLine)) / 2;
            }
            this.topText.renderText(ctx, startX, this.topRenderY);
            startX = x + this.botStartX;
            this.botRenderY = stave.getYForLine(this.bottomLine + this.lineShift);
            this.botText.renderText(ctx, startX, this.botRenderY);
        }
        else {
            this.renderText(ctx, x - this.x, stave.getYForLine(this.line));
        }
    }
    getBoundingBox() {
        if (this.isNumeric) {
            const topBoundingBox = this.topText.getBoundingBox();
            const botBoundingBox = this.botText.getBoundingBox();
            topBoundingBox.move(this.x + this.topStartX, this.topRenderY);
            botBoundingBox.move(this.x + this.botStartX, this.botRenderY);
            const mergedBox = topBoundingBox.mergeWith(botBoundingBox);
            return mergedBox;
        }
        else {
            const stave = this.checkStave();
            const textBoundingBox = super.getBoundingBox();
            textBoundingBox.move(0, stave.getYForLine(this.line));
            return textBoundingBox;
        }
    }
}
