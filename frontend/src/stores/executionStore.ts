import { create } from 'zustand'

import { instruction, parsedVariable, parseVariableValue } from 'utils/executor'

interface dataVal {
  name: string
  value: parsedVariable
}

interface ExecutionState {
  currentStep: number
  setStep: (step: number) => void
  rawInstructions: instruction[]
  instructions: instruction[]
  setInstructions: (instructions: instruction[]) => void
  data: dataVal[]
  allVariableNames: string[]
  selectedLineNumbers: number[]
  updateSelectedLineNumbers: (lineNumbers: number[]) => void
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  currentStep: 0,
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
  rawInstructions: [],
  instructions: [],
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
  data: [],
  allVariableNames: [],
  selectedLineNumbers: [],
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
}))

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
    for (let j = rangeStart; j <= i; j++)
      Object.assign(instruction, {
        global_variable_changes: rawInstructions[j].global_variable_changes,
        local_variable_changes: rawInstructions[j].local_variable_changes,
      })
    rangeStart = i + 1
    newInstructions.push(instruction)
  }
  return newInstructions
}
