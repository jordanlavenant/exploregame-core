import { ScriptStep, UpdateScriptStepInput } from 'types/graphql'

export const saveScriptSteps = async ({
  currScriptSteps,
  updateScriptStep,
}: {
  currScriptSteps: Partial<ScriptStep>[]
  updateScriptStep: (variables: {
    variables: { id: string; input: UpdateScriptStepInput }
  }) => Promise<void>
}) => {
  if (!currScriptSteps || currScriptSteps.length === 0) {
    return
  }

  console.log('0')

  for (const scriptStep of currScriptSteps) {
    updateScriptStep({
      variables: {
        id: scriptStep.id,
        input: {
          order: scriptStep.order,
        },
      },
    })
  }
}
