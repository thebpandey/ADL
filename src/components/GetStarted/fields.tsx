/**
 * Guided installer — accessible form field primitives.
 */
import React, { useId } from "react";
import styles from "./styles.module.css";

export interface Option<T extends string = string> {
  value: T;
  label: string;
  detail?: string;
}

export function RadioGroup<T extends string>(props: {
  label: string;
  hint?: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  inline?: boolean;
}) {
  const id = useId();
  return (
    <fieldset className={styles.field} style={{ border: 0, padding: 0, margin: "0 0 1.25rem" }}>
      <legend className={styles.fieldLabel}>{props.label}</legend>
      {props.hint && <span className={styles.fieldHint}>{props.hint}</span>}
      <div className={`${styles.choices} ${props.inline ? styles.choicesInline : ""}`} role="radiogroup" aria-label={props.label}>
        {props.options.map((o) => (
          <label
            key={o.value}
            className={`${styles.choice} ${props.value === o.value ? styles.choiceSelected : ""}`}
          >
            <input
              type="radio"
              name={id}
              value={o.value}
              checked={props.value === o.value}
              onChange={() => props.onChange(o.value)}
            />
            <span>
              {o.label}
              {o.detail && <span className={styles.choiceDetail}>{o.detail}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CheckboxGroup<T extends string>(props: {
  label: string;
  hint?: string;
  options: Option<T>[];
  value: T[];
  onChange: (v: T[]) => void;
}) {
  const toggle = (v: T) => {
    props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
  };
  return (
    <fieldset className={styles.field} style={{ border: 0, padding: 0, margin: "0 0 1.25rem" }}>
      <legend className={styles.fieldLabel}>{props.label}</legend>
      {props.hint && <span className={styles.fieldHint}>{props.hint}</span>}
      <div className={styles.choices}>
        {props.options.map((o) => (
          <label
            key={o.value}
            className={`${styles.choice} ${props.value.includes(o.value) ? styles.choiceSelected : ""}`}
          >
            <input
              type="checkbox"
              checked={props.value.includes(o.value)}
              onChange={() => toggle(o.value)}
            />
            <span>
              {o.label}
              {o.detail && <span className={styles.choiceDetail}>{o.detail}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TextField(props: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {props.label}
      </label>
      {props.hint && (
        <span className={styles.fieldHint} id={`${id}-hint`}>
          {props.hint}
        </span>
      )}
      <input
        id={id}
        className={styles.textInput}
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        aria-describedby={props.hint ? `${id}-hint` : undefined}
        aria-invalid={props.error ? true : undefined}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.error && (
        <span role="alert" className={styles.fieldHint} style={{ color: "#b3402f" }}>
          {props.error}
        </span>
      )}
    </div>
  );
}

export function NumberField(props: {
  label: string;
  hint?: string;
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {props.label}
        {props.unit ? ` (${props.unit})` : ""}
      </label>
      {props.hint && (
        <span className={styles.fieldHint} id={`${id}-hint`}>
          {props.hint}
        </span>
      )}
      <input
        id={id}
        className={styles.textInput}
        type="number"
        inputMode="decimal"
        value={props.value ?? ""}
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        aria-describedby={props.hint ? `${id}-hint` : undefined}
        onChange={(e) => {
          const raw = e.target.value;
          props.onChange(raw === "" ? null : Number(raw));
        }}
      />
    </div>
  );
}

export function SelectField<T extends string>(props: {
  label: string;
  hint?: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {props.label}
      </label>
      {props.hint && (
        <span className={styles.fieldHint} id={`${id}-hint`}>
          {props.hint}
        </span>
      )}
      <select
        id={id}
        className={styles.selectInput}
        value={props.value ?? ""}
        aria-describedby={props.hint ? `${id}-hint` : undefined}
        onChange={(e) => props.onChange((e.target.value || undefined) as T | undefined)}
      >
        <option value="">{props.placeholder ?? "Select…"}</option>
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
