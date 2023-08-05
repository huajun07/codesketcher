import { create } from 'zustand'

import { instruction, parsedVariable, parseVariableValue } from 'utils/executor'

interface dataVal {
  name: string
  value: parsedVariable
}

export interface ExecutionState {
  currentStep: number
  setStep: (step: number) => void
  rawInstructions: instruction[] // All instructions
  instructions: instruction[] // Reduced selected instructions
  setInstructions: (instructions: instruction[]) => void
  data: dataVal[] // Data of the current state of variables during the execution
  allVariableNames: string[] // List of all variables names in the entire execution
  selectedLineNumbers: number[]
  updateSelectedLineNumbers: (lineNumbers: number[]) => void
}

const defaultValues = {
  currentStep: 0,
  instructions: [],
  rawInstructions: [],
  data: [],
  allVariableNames: [],
  selectedLineNumbers: [],
}

/**
 * Factory function for execution store
 * with option to seed inital values (For automated tests)
 * @param initalValues Initial Values (optional)
 * @returns 
 */
export const createExecutionStore = (initialState: Partial<ExecutionState>) => {
  return create<ExecutionState>((set, get) => ({
    ...defaultValues,
    /**
     * Change the current execution step to given value.
     * Note this operation updates all related variables like table data
     * @param step 
     */
    setStep: (step: number) => {
      const newData: dataVal[] = []
      for (let i = 0; i < step; i++) {
        // local_variable_changes and global_variable_changes will be merged for now,
        // so that the frontend retains the same behaviour. Will be changed once we decide
        // how to deal with function scopes in the frontend
        const newInstruction = {
          ...get().instructions[i].local_variable_changes,
          ...get().instructions[i].global_variable_changes,
        }
        for (const [name, value] of Object.entries(newInstruction)) {
          const idx = newData.findIndex((item) => item.name === name)
          const newValue = { name, value: parseVariableValue(value) }
          if (idx !== -1) newData[idx] = newValue
          else newData.push(newValue)
        }
      }
      set({ currentStep: step, data: newData })
    },
    /**
     * Resets the execution from the start with new instructions.
     * @param instructions New instructions 
     */
    setInstructions: (instructions: instruction[]) => {
      const allVariableNames = new Set<string>()
      for (let i = 0; i < instructions.length; i++) {
        // local_variable_changes and global_variable_changes will be merged for now,
        // so that the frontend retains the same behaviour. Will be changed once we decide
        // how to deal with function scopes in the frontend
        const newInstruction = {
          ...instructions[i].local_variable_changes,
          ...instructions[i].global_variable_changes,
        }
        Object.keys(newInstruction).forEach((name) => allVariableNames.add(name))
      }
      set({
        currentStep: 0,
        rawInstructions: instructions,
        instructions: processInstructions(
          instructions,
          get().selectedLineNumbers,
        ),
        data: [],
        allVariableNames: [...allVariableNames],
      })
    },
    /**
     * Update select breakpoint line numbers and resets the executions
     * Note that this function will only trigger a update in the execution instruction if there is a change in the set of selected line numbers 
     * @param lineNumbers 
     */
    updateSelectedLineNumbers: (lineNumbers: number[]) => {
      let unchanged = true
      if (lineNumbers.length !== get().selectedLineNumbers.length)
        unchanged = false
      else {
        for (let i = 0; i < lineNumbers.length; i++) {
          if (lineNumbers[i] !== get().selectedLineNumbers[i]) unchanged = false
        }
      }
      if (unchanged) return
      set({
        selectedLineNumbers: lineNumbers,
        instructions: processInstructions(get().rawInstructions, lineNumbers),
        data: [],
        currentStep: 0,
      })
    },
    ...initialState
  }))
}

/**
 * Process the raw instructions, only considering instructions at selected line numbers
 * merging the changes by unselected instructions into selected instructions.
 * @param rawInstructions All instructions retrieved from the executor endpoint
 * @param lineNumbers Selected breakpoint line numbers
 * @returns Reduced merged instructions
 */
function processInstructions(
  rawInstructions: instruction[],
  lineNumbers: number[],
): instruction[] {
  const newInstructions: instruction[] = []
  const lineNumberSet = new Set(lineNumbers)
  let rangeStart = 0
  for (let i = 0; i < rawInstructions.length; i++) {
    if (
      lineNumberSet.size > 0 &&
      !lineNumberSet.has(rawInstructions[i].line_number)
    )
      continue
    const instruction = {
      line_number: rawInstructions[i].line_number,
      function_scope: rawInstructions[i].function_scope,
      global_variable_changes: {},
      local_variable_changes: {},
    }
    for (let j = rangeStart; j <= i; j++) {
      Object.assign(
        instruction.global_variable_changes,
        rawInstructions[j].global_variable_changes,
      )
      Object.assign(
        instruction.local_variable_changes,
        rawInstructions[j].local_variable_changes,
      )
    }
    rangeStart = i + 1
    newInstructions.push(instruction)
  }
  return newInstructions
}

export const useExecutionStore = createExecutionStore({})
