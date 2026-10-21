import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "./Input";
import { Select } from "../Select/Select";
import { Typeahead } from "../Typeahead/Typeahead";
import { DateInput } from "../DateInput/DateInput";

afterEach(cleanup);

const fields: [string, (hideLabel?: boolean) => ReactElement][] = [
  ["Input", (hideLabel) => <Input label="Beneficiário" hideLabel={hideLabel} />],
  ["Select", (hideLabel) => <Select label="Beneficiário" hideLabel={hideLabel} options={[{ value: "a", label: "A" }]} />],
  ["Typeahead", (hideLabel) => <Typeahead label="Beneficiário" hideLabel={hideLabel} suggestions={[]} />],
  ["DateInput", (hideLabel) => <DateInput label="Beneficiário" hideLabel={hideLabel} />],
];

describe.each(fields)("%s hideLabel", (_name, field) => {
  const label = () => document.querySelector("label") as HTMLLabelElement;

  it("shows the label by default", () => {
    render(field());

    expect(label().classList.contains("hds-visually-hidden")).toBe(false);
  });

  it("keeps the label for screen readers only, so the field is still named", () => {
    render(field(true));

    expect(label().classList.contains("hds-visually-hidden")).toBe(true);
    expect(screen.getByLabelText("Beneficiário")).toBeTruthy();
  });
});
