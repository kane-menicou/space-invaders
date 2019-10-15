export function onKeyUp (key, state) {
  return {
    ...state,
    pressedKeys: state.pressedKeys.filter(check => key.toUpperCase() !== check.toUpperCase())
  }
}

export function onKeyDown (key, state) {
  if (state.pressedKeys.indexOf(key.toUpperCase()) !== -1) {
    return state
  }

  const newState = {...state}

  newState.pressedKeys.push(key.toUpperCase())

  return newState
}


