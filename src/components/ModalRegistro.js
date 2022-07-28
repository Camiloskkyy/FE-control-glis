import React from 'react';
import { gql } from '@apollo/client';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';


const CREAR_REGISTRO = gql`
    mutation crearRegistro($input: RegistroInput) {
      crearRegistro(input: $input) {
          medicion
        }}`;

const OBTENER_USUARIO_ACTUAL = gql`
query obtenerUser ($token: String!){
    obtenerUser(token: $token) {
      rut
    }
}
`;

function ModalRegistro({ setSmShow }) {
    let today = new Date();
    let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();

    const [crearRegistro] = useMutation(CREAR_REGISTRO);
    var { data } = useQuery(OBTENER_USUARIO_ACTUAL, {
        variables: {
            token: localStorage.getItem('token')
        }
    });
    var aux

    if (data) {
        aux = data

    }

    const formik = useFormik({
        initialValues: {
            medicion: '',
            unidad_de_medida: 'mg/dL',
            fecha_creacion: '',
            user: "",
        },
        validationSchema: Yup.object({
            medicion: Yup.string()
                .required('Medicion obligatoria'),
            unidad_de_medida: Yup.string()
                .required('Unidad de medida obligatoria'),
            fecha_creacion: Yup.string()
            ,
            user: Yup.string()
        }),
        onSubmit: async valores => {
            const { unidad_de_medida } = valores;
            const medicion = parseInt(valores.medicion);
            const fecha_creacion = valores.fecha_creacion;
            const user = aux.obtenerUser.rut
            console.log(medicion, unidad_de_medida, fecha_creacion, user);
            try {

                const { data } = await crearRegistro({
                    variables: {
                        input: {
                            medicion,
                            unidad_de_medida,
                            fecha_creacion,
                            user,
                        }
                    }
                });
                console.log(data)
                setSmShow(false);
            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <>
            <form
                className="bg-white rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={formik.handleSubmit}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="medicion">
                        Medición
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="medicion"
                        type="text"
                        placeholder="100"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.medicion}
                    />
                </div>

                {formik.touched.medicion && formik.errors.medicion ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" >
                        <p className="font-bold pl-2 mb-0">Error</p>
                        <p className="pl-2 mb-0">{formik.errors.medicion}</p>



                    </div>
                ) : null}

                <div className="mb-4">

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unidad_de_medida">
                        Unidad de medida
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="unidad_de_medida"
                        type="text"
                        placeholder="mg/dL"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.unidad_de_medida}

                    />
                </div>

                {formik.touched.unidad_de_medida && formik.errors.unidad_de_medida ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                        <p className="font-bold">Error</p>
                        <p>{formik.errors.unidad_de_medida}</p>
                    </div>
                ) : null}

                <div className="mb-4">

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_creacion">
                        Fecha creacion
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="fecha_creacion"
                        type="text"
                        placeholder="MM-DD-YYYY"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fecha_creacion}
                    />
                </div>

                {formik.touched.fecha_creacion && formik.errors.fecha_creacion ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                        <p className="font-bold">Error</p>
                        <p>{formik.errors.fecha_creacion}</p>
                    </div>
                ) : null}

                <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:cursor-pointer hover:bg-gray-900"
                    value="Agregar Registro"
                />

            </form>

        </>
    );
}

//render(<ModalForm />);
export default ModalRegistro;