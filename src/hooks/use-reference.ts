export type Reference = ReturnType<typeof useReference>

const useReference = <S>(reference?: S) => {

  return {
    reference,
  }

}

export {
  useReference
};