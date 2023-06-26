import { create } from 'zustand'

import { instruction, parsedVariable, parseVariableValue } from 'utils/executor'

interface dataVal {
  name: string
  value: parsedVariable
}

interface ExecutionState {
  currentStep: number
  setStep: (step: number) => void
  instructions: instruction[]
  setInstructions: (instructions: instruction[]) => void
  data: dataVal[]
  allVariableNames: string[]
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
      instructions,
      data: [],
      allVariableNames: [...allVariableNames],
    })
  },
  data: [],
  allVariableNames: [],
}))
