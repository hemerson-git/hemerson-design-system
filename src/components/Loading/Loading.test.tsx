import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Loading } from "./Loading";

afterEach(cleanup);

describe("Loading", () => {
  it("announces “Loading…” by default, for screen readers only", () => {
    render(<Loading />);

    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Loading…");
    expect(screen.getByText("Loading…").className).toBe("hds-visually-hidden");
  });

  it("announces its own label, shown beside the spinner with showLabel", () => {
    render(<Loading label="Loading pages…" showLabel />);

    expect(screen.getByRole("status").textContent).toBe("Loading pages…");
    expect(screen.getByText("Loading pages…").className).toBe("");
  });

  it("takes its size as a class", () => {
    render(<Loading size="lg" />);

    expect(screen.getByRole("status").classList.contains("hds-loading--lg")).toBe(true);
  });
});
