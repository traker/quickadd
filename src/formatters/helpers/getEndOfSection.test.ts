import { test, expect } from "vitest";
import getEndOfSection from "./getEndOfSection";

test("getEndOfSection - find the end of a section", () => {
	const lines = [
		"# Title",
		"",
		"## Section 1", // target (2)
		"Content 1", // result (3)
		"",
		"## Section 2",
		"Content 2",
		"",
		"# Title 2",
	];
	const targetLine = 2;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(3);
});

test("getEndOfSection - find the end of the last section", () => {
	const lines = [
		"# Title",
		"",
		"## Section 1",
		"Content 1",
		"",
		"## Section 2",
		"Content 2",
		"",
		"# Title 2", // target (8)
		"", // result (9)
	];
	const targetLine = 8;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(9);
});

test("getEndOfSection - find end of section with multiple empty lines", () => {
	const lines = [
		"# Title",
		"",
		"## Section 1", // target (2)
		"Content 1", // result (4)
		"",
		"",
		"## Section 2",
		"Content 2",
		"",
		"# Title 2",
	];
	const targetLine = 2;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(3);
});

test("getEndOfSection - find end of section without a higher level section", () => {
	const lines = [
		"# Title",
		"",
		"## Section 1", // target (2)
		"Content 1", // result (3)
		"",
		"## Section 2",
		"Content 2",
		"",
		"## Section 3",
		"Content 3",
	];
	const targetLine = 2;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(3);
});

test("getEndOfSection - find end of section with higher level section", () => {
	const lines = [
		"# Title", // target (0)
		"",
		"## Section 1",
		"Content 1",
		"",
		"## Section 2",
		"Content 2", // result (6)
		"",
		"# Title 2",
		"Content 3",
	];
	const targetLine = 0;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(6);
});

test("getEndOfSection - find end of section with no headings", () => {
	const lines = [
		"Content 1",
		"",
		"Content 2", // target (2)
		"Content 3", // result (3)
		"",
		"Content 4",
	];
	const targetLine = 2;

	const result = getEndOfSection(lines, targetLine);
	expect(result).toBe(3);
});

test("getEndOfSection - find end of section with top level heading and only sub headings", () => {
	const lines = [
		"# Notes", // target (0)
		"",
		"## Topic A",
		"content a1",
		"content a2",
		"content a3",
		"",
		"---",
		"Thematic break",
		"1",
		"2",
		"3",
		"",
		"## Topic B",
		"content b1", // result (14)
		"",
		"",
	];

	const targetLine = 0;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(14);
});

test("getEndOfSection - target isn't heading", () => {
	const lines = [
		"# Notes",
		"",
		"## Topic A",
		"content a1", // target (3)
		"content a2",
		"content a3", // result (5)
		"",
		"---",
		"Thematic break",
		"1",
		"2",
		"3",
		"",
		"## Topic B",
		"content b1",
		"",
		"",
	];

	const targetLine = 3;

	const result = getEndOfSection(lines, targetLine, false);
	expect(result).toBe(5);
});

test("getEndOfSection - target is heading, should not consider subsections", () => {
	const lines = [
		"# Notes",
		"",
		"## Topic A", // target (2)
		"content a1",
		"content a2",
		"content a3", // result (5)
		"## Topic B",
		"content b1",
		"",
		"",
	];

	const targetLine = 2;

	const result = getEndOfSection(lines, targetLine, false);
	expect(result).toBe(5);
});

test("getEndOfSection - target is heading, should consider subsections", () => {
	const lines = [
		"# Notes", // target (0)
		"",
		"## Topic A",
		"content a1",
		"## Topic B",
		"content b1",
		"### contentA",
		"content",
		"#### contentB",
		"content",
		"content", // target (10)
	];

	const targetLine = 0;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(10);
});

test("getEndOfSection - Capture to first line, shoudlConsiderSubsections ON", () => {
	const lines = [
		"# Meeting Notes", // target (0)
		"",
		"### Topic A",
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet commodo mi, nec consequat tellus.",
		"",
		"### Topic B",
		"Aliquam erat volutpat. Nullam fringilla, enim eu volutpat congue, odio elit imperdiet felis, non congue est justo cursus dui.", // result (6)
	];

	const targetLine = 0;

	const result = getEndOfSection(lines, targetLine, true);
	expect(result).toBe(6);
});

test("getEndOfSection - Capture to first line, shoudlConsiderSubsections OFF", () => {
	const lines = [
		"# Meeting Notes", // target (0)
		"", // result (1)
		"### Topic A",
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet commodo mi, nec consequat tellus.",
		"",
		"### Topic B",
		"Aliquam erat volutpat. Nullam fringilla, enim eu volutpat congue, odio elit imperdiet felis, non congue est justo cursus dui.",
	];

	const targetLine = 0;

	const result = getEndOfSection(lines, targetLine, false);
	expect(result).toBe(1);
});
