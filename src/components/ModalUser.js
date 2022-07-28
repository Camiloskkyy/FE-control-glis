import React from 'react';
import { gql } from '@apollo/client';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';

const CREAR_USER = gql`
    mutation crearUsuario($input: UsuarioInput) {
      crearUsuario(input: $input) {
          name
        }}`;

function ModalUser({ setLgShow }) {

    const [crearUsuario] = useMutation(CREAR_USER);

    const formik = useFormik({
        initialValues: {
            name: '',
            rut: '',
            type: '',
            password: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('name obligatoria'),
            rut: Yup.string()
                .required('Unidad de medida obligatoria'),
            type: Yup.string()
            ,
            password: Yup.string()
        }),
        onSubmit: async valores => {
            console.log(valores)
            const rut  = valores.rut;
            const name = valores.name;
            const type = valores.type
            const password = valores.password
            console.log(name, rut, type, password);
            try {

                const { data } = await crearUsuario({
                    variables: {
                        input: {
                            name,
                            rut,
                            type,
                            password,
                        }
                    }
                });
                console.log(data)
                setLgShow(false);
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nombre
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Juanito Perez"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                </div>

                {formik.touched.name && formik.errors.name ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" >
                        <p className="font-bold pl-2 mb-0">Error</p>
                        <p className="pl-2 mb-0">{formik.errors.name}</p>



                    </div>
                ) : null}

                <div className="mb-4">

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
                        Rut
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="rut"
                        type="text"
                        placeholder="12.345.678-9"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rut}

                    />
                </div> 
                {formik.touched.rut && formik.errors.rut ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                        <p className="font-bold">Error</p>
                        <p>{formik.errors.rut}</p>
                    </div>
                ) : null}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                        Tipo de usuario
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="type"
                        type="text"
                        placeholder="medico/paciente"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.type}
                    />
                </div>

                {formik.touched.type && formik.errors.type ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" >
                        <p className="font-bold pl-2 mb-0">Error</p>
                        <p className="pl-2 mb-0">{formik.errors.type}</p>



                    </div>
                ) : null}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="********"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                </div>

                {formik.touched.password && formik.errors.password ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" >
                        <p className="font-bold pl-2 mb-0">Error</p>
                        <p className="pl-2 mb-0">{formik.errors.password}</p>



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
export default ModalUser;