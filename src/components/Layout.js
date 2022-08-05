import React, { useEffect } from 'react'
import Sidebar from './Sidebar';
import Table from "./UserTable";
import ChartWeek from './ChartWeek';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'react-chatbox-component/dist/style.css';
import { gql, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const OBTENER_USUARIO_ACTUAL = gql`
     query obtenerUser ($token: String!){
         obtenerUser(token: $token) {
           rut
         }
     }
`;

const client = new ApolloClient({
    uri: 'http://192.168.100.100:4000',
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



const Layout = ({ children }) => {
    // Hook de routing
    //var [rut, setRut] = useState(false);
    var rut
    var { data } = useQuery(OBTENER_USUARIO_ACTUAL, {
        variables: {
            token: localStorage.getItem('token')
        }
    });
    console.log(data)

    useEffect(() => {
        if (data) {
            client.query({
                query: obtenerMensajes,
                variables: {
                    rut_from: data.obtenerUser.rut
                }
            }).then(resp => {

                console.log(resp)

            })
        }
    }, [data]);

    const sendMessage = (event) => {
        console.log(event)
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        //setRut(event.target.elements[0].value)
        rut = event.target.elements[0].value
        console.log(rut)
    }

    const handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        
        // Now send the message throught the backend API
      };

    return (
        <>
            <div className="bg-gray-200 min-h-screen">
                <div className='flex min-h-screen'>
                    <Sidebar />
                            <Widget
          handleNewUserMessage={handleNewUserMessage}
          title="Control Glis"
          subtitle="Chat con tu medico"
        />
                    <main className='sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5'>
                        <Table />
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit" >
                                Submit
                            </Button>
                        </Form>
                        <ChartWeek rut={rut} />
                    </main>

                </div>

            </div>

        </>
    );
}

export default Layout;