import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import Table from "./UserTable";
import ChartWeek from './ChartWeek';
import 'react-chatbox-component/dist/style.css';
import { gql, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { Widget, addResponseMessage, addUserMessage, deleteMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const OBTENER_USUARIO_ACTUAL = gql`
     query obtenerUser ($token: String!){
         obtenerUser(token: $token) {
           rut
           type
         }
     }
`;

const client = new ApolloClient({
    uri: 'https://apollo-server-cmp.herokuapp.com',
    cache: new InMemoryCache(),
});

const obtenerMensajes = gql`
query obtenerMensajes($rut_from: String!){
    obtenerMensajes(rut_from:$rut_from){
        rut_from
        rut_to
        content
        created
    }
}
`;

const crearMensaje = gql`
mutation crearMensaje($input: MessageInput) { 
    crearMensaje(input: $input){
        rut_from
        content
        created
    }
}
`;

const Layout = ({ children }) => {
    // Hook de routing
    //var rut
    const [currentType, setCurrentType] = useState('')

    var { data } = useQuery(OBTENER_USUARIO_ACTUAL, {
        variables: {
            token: localStorage.getItem('token')
        }
    });
    var aux
    useEffect(() => {
        if (data) {
            setCurrentType(data.obtenerUser.type === 'medico')
            client.query({
                query: obtenerMensajes,
                variables: {
                    rut_from: data.obtenerUser.rut
                }
            }).then(resp => {
                aux = resp
                console.log(resp.data.obtenerMensajes)
                for (let i = 0; i < resp.data.obtenerMensajes.length; i++) {
                    if (resp.data.obtenerMensajes[i].rut_to === data.obtenerUser.rut) {
                        addResponseMessage(resp.data.obtenerMensajes[i].content);
                    } else {
                        addUserMessage(resp.data.obtenerMensajes[i].content)
                    }
                }

            })
            const interval = setInterval(() => {
                client.query({
                    query: obtenerMensajes,
                    variables: {
                        rut_from: data.obtenerUser.rut
                    },
                    fetchPolicy: 'no-cache'
                }).then(resp => {

                    //get diff between two objects by data.obtenerMensajes.length
                    var diff = resp.data.obtenerMensajes.length - aux.data.obtenerMensajes.length;

                    if (diff > 0) {
                        deleteMessages()
                        for (let i = 0; i < resp.data.obtenerMensajes.length; i++) {
                            if (resp.data.obtenerMensajes[i].rut_to === data.obtenerUser.rut) {
                                addResponseMessage(resp.data.obtenerMensajes[i].content);
                            } else {
                                addUserMessage(resp.data.obtenerMensajes[i].content)
                            }
                        }
                    }
                })
            }, 1000);

            return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        }
    }, [data]);



    const handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        //deleteMessages()
        var toSend = ""
        if (data.obtenerUser.rut === "15.567.888-2") {
            toSend = "19.513.744-7"
        } else {
            toSend = "15.567.888-2"
        }
        addUserMessage(newMessage)
        client.mutate({
            mutation: crearMensaje,
            variables: {
                input: {
                    rut_from: data.obtenerUser.rut,
                    rut_to: toSend,
                    content: newMessage
                }
            }
        })
    };


    return (
        <>
            <div className="bg-gray-200 min-h-screen">
                <div className='flex min-h-screen'>
                    <Sidebar data={data} />
                    <Widget
                        handleNewUserMessage={handleNewUserMessage}
                        title="Ctrl Glis"
                        subtitle="Chat con tu medico"
                    />
                    <main className='grayscale sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5' STYLE="background:url('https://img.freepik.com/fotos-premium/doctor-medicina-estetoscopio-sosteniendo-formulario-solicitud-blanco_43284-1855.jpg?w=1380')">
                        {currentType && < Table />}
                        <ChartWeek />
                        <p class="text-red-600">Recomendacion: no superar mas de 28 mg/Dl el promedio indicado</p>
                        <p class="text-red-600">Recomendacion: no disminuir mas de 28 mg/Dl el promedio indicado</p>
                        <p class="text-red-600">Recomendacion: Mantenerse dentro del promedio indicado</p>
                        <p class="text-red-600">Recomendacion: En caso de sobrepasar los valores contactar al medico</p>
                    </main>

                </div>

            </div>

        </>
    );
}

export default Layout;