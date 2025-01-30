export type Reference = ReturnType<typeof useReference>

const useReference = <S>(reference?: S) => {
<<<<<<< HEAD

  return {
    reference,
  }

=======
//  const ref = new SignalReference(reference);
//
//  return ref;
>>>>>>> 54b5668155d0f83eeb291bcec6d3d77a0f0fdf14
}

export {
  useReference
};