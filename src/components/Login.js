import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input : AutenticarInput) {
        autenticarUsuario(input : $input) {
            token
        }
    }
`;



const Login = () => {
    const navigate = useNavigate();
    const [guardarMensaje] = useState(null);
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const formik = useFormik({
        initialValues: {
            rut: '',
            password: ''
        },
        validationSchema: Yup.object({
            rut: Yup.string()
                .required('El rut no puede ir vacio'),
            password: Yup.string()
                .required('El password es obligatorio')
        }),
        onSubmit: async valores => {
            const { rut, password } = valores;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            rut,
                            password
                        }
                    }
                });
                //console.log(autenticarUsuario)

                // Guardar el token en localstorage
                setTimeout(() => {
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                    //console.log(localStorage.getItem('token'));
                }, 1000);


                // Redireccionar hacia clientes
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);

            } catch (error) {
                console.log(error);

                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }
        }
    })

    return (
        <div className='bg-gray-800 min-h-screen flex flex-col justify-center text-center text-2xl text-white font-light'>
            Login
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form
                        className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
                                rut
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="******"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                        </div>

                        {formik.touched.password && formik.errors.password ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.password}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:cursor-pointer hover:bg-gray-900"
                            value="Iniciar Sesión"
                        />

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
