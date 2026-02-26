/**
 * Utility functions for handling sound selections
 */

export interface SoundSelection {
  label: string;
  downloadUrl: string;
}

/**
 * Parse selections from the checkbox format into structured objects
 * @param selections Array of strings in format "label||downloadUrl"
 * @returns Array of SoundSelection objects
 * @throws Error if any selection is malformed
 */
export function parseSelections(selections: string[]): SoundSelection[] {
  if (selections.length === 0) {
    throw new Error("No sounds selected. Please select at least one sound.");
  }

  return selections.map((selection, index) => {
    const parts = selection.split("||");
    
    if (parts.length < 2 || !parts[1]) {
      throw new Error(`Invalid selection format at index ${index}: ${selection}`);
    }
    
    const label = parts[0] || `Unknown sound ${index + 1}`;
    
    return {
      label: label,
      downloadUrl: parts[1]
    };
  });
}

/**
 * Get a safe message for the selection prompt
 * @param selections Parsed selections
 * @returns Appropriate message string
 */
export function getSelectionMessage(selections: SoundSelection[]): string {
  if (selections.length === 0) {
    return "Selected: Unknown";
  }
  const firstSelection = selections[0];
  if (selections.length === 1 && firstSelection) {
    return `Selected: ${firstSelection.label}`;
  } else {
    return `Selected ${selections.length} sounds`;
  }
}

/**
 * Determine if multiple sounds are selected
 * @param selections Parsed selections
 * @returns true if multiple selections, false otherwise
 */
export function isMultipleSelection(selections: SoundSelection[]): boolean {
  return selections.length > 1;
}

/**
 * Safely get the first selection
 * @param selections Parsed selections
 * @returns First selection or undefined if empty
 */
export function getFirstSelection(selections: SoundSelection[]): SoundSelection | undefined {
  return selections[0];
}