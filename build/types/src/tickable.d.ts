import { Element } from './element';
import { Fraction } from './fraction';
import { Modifier } from './modifier';
import { ModifierContext } from './modifiercontext';
import { Stave } from './stave';
import { TickContext } from './tickcontext';
import { Tuplet } from './tuplet';
import { Voice } from './voice';
/** Formatter metrics interface */
export interface FormatterMetrics {
    duration: string;
    freedom: {
        left: number;
        right: number;
    };
    iterations: number;
    space: {
        used: number;
        mean: number;
        deviation: number;
    };
}
/**
 * Tickable represents a element that sit on a score and
 * has a duration, i.e., Tickables occupy space in the musical rendering dimension.
 */
export declare abstract class Tickable extends Element {
    static get CATEGORY(): string;
    protected ignoreTicks: boolean;
    protected tupletStack: Tuplet[];
    protected ticks: Fraction;
    protected centerXShift: number;
    protected voice?: Voice;
    protected modifierContext?: ModifierContext;
    protected tickContext?: TickContext;
    protected modifiers: Modifier[];
    protected tickMultiplier: Fraction;
    protected formatterMetrics: FormatterMetrics;
    protected intrinsicTicks: number;
    protected alignCenter: boolean;
    private _preFormatted;
    private _postFormatted;
    constructor();
    /** Reset the Tickable, this function will be overloaded. */
    reset(): this;
    /** Return the ticks. */
    getTicks(): Fraction;
    /** Check if it ignores the ticks. */
    shouldIgnoreTicks(): boolean;
    /** Ignore the ticks. */
    setIgnoreTicks(flag: boolean): this;
    /** Get width of note. Used by the formatter for positioning. */
    getWidth(): number;
    /** Get `x` position of this tick context. */
    getX(): number;
    /** Return the formatterMetrics. */
    getFormatterMetrics(): FormatterMetrics;
    /** Return the center `x` shift. */
    getCenterXShift(): number;
    /** Set the center `x` shift. */
    setCenterXShift(centerXShift: number): this;
    isCenterAligned(): boolean;
    setCenterAlignment(alignCenter: boolean): this;
    /**
     * Return the associated voice. Every tickable must be associated with a voice.
     * This allows formatters and preFormatter to associate them with the right modifierContexts.
     */
    getVoice(): Voice;
    /** Set the associated voice. */
    setVoice(voice: Voice): void;
    /** Get the Tuplet if any.
     * If there are multiple Tuplets, the most recently added one is returned. */
    getTuplet(): Tuplet | undefined;
    /** Return a readonly array of Tuplets (might be empty). */
    getTupletStack(): readonly Tuplet[];
    /**
     * Remove the given tuplet; raises an Error if the tuplet is not in the TupletStack.
     */
    removeTuplet(tuplet: Tuplet): this;
    /**
     * Remove all tuplets from the tickable.
     */
    clearTuplets(): this;
    /**
     * Deprecated, to be removed in v6.  Use `removeTuplet(tuplet)` or `clearTuplets()` instead.
     * Reset the specific Tuplet (if this is not provided, all tuplets are reset).
     * Remove any prior tuplets from the tick calculation and
     * reset the intrinsic tick value.
     */
    resetTuplet(tuplet?: Tuplet): this;
    /** Set the tuplet to the given Tuplet.  If there are existing tuplets clears them first. */
    setTuplet(tuplet: Tuplet): this;
    /** Add the given Tuplet to the tupletStack without clearing it first. */
    addTuplet(tuplet: Tuplet): this;
    /**
     * Sets all the tuplets on the tickable to the given tupletStack.  Note that
     * a new array is created on the tickable, so manipulating the array that is
     * passed in will not affect the tupletStack used by the tickable.
     */
    setTupletStack(tupletStack: Tuplet[]): this;
    /**
     * Add self to the provided ModifierContext `mc`.
     * If this tickable has modifiers, set modifierContext.
     * @returns this
     */
    addToModifierContext(mc: ModifierContext): this;
    /**
     * Optional, if tickable has modifiers, associate a Modifier.
     */
    addModifier(modifier: Modifier, index?: number): this;
    /** Get the list of associated modifiers. */
    getModifiers(): Modifier[];
    /** Set the Tick Context. */
    setTickContext(tc: TickContext): void;
    checkTickContext(message?: string): TickContext;
    /** Preformat the Tickable. */
    preFormat(): void;
    /** Set preformatted status. */
    set preFormatted(value: boolean);
    get preFormatted(): boolean;
    /** Postformat the Tickable. */
    postFormat(): this;
    /** Set postformatted status. */
    set postFormatted(value: boolean);
    get postFormatted(): boolean;
    /** Return the intrinsic ticks as an integer. */
    getIntrinsicTicks(): number;
    /** Set the intrinsic ticks as an integer. */
    setIntrinsicTicks(intrinsicTicks: number): void;
    /** Get the tick multiplier as a Fraction.  Defaults to Fraction(1, 1). */
    getTickMultiplier(): Fraction;
    /** Apply a tick multiplier, by multiplying the current tickMultiplier by
     * the numerator and denominator given here. Updates ticks. */
    applyTickMultiplier(numerator: number, denominator: number): void;
    /** Set the duration. */
    setDuration(duration: Fraction): void;
    getAbsoluteX(): number;
    /** Attach this note to a modifier context. */
    setModifierContext(mc?: ModifierContext): this;
    /** Get `ModifierContext`. */
    getModifierContext(): ModifierContext | undefined;
    /** Check and get `ModifierContext`. */
    checkModifierContext(): ModifierContext;
    /** Get the target stave. */
    abstract getStave(): Stave | undefined;
    /** Set the target stave. */
    abstract setStave(stave: Stave): this;
    abstract getMetrics(): any;
}
