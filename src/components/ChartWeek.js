import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { gql, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';


const OBTENER_USUARIO_ACTUAL = gql`
query obtenerUser ($token: String!){
    obtenerUser(token: $token) {
      rut
      average
      type
    }
}
`;

const obtenerRegistros_ByUserRut = gql`
query obtenerRegistros_ByUserRut($rut: String!) { 
    obtenerRegistros_ByUserRut(rut: $rut){
        medicion
        unidad_de_medida
        fecha_creacion
    }
}
`;

const OBTENER_USUARIO_RUT = gql`
     query obtenerUser_ByRut ($rut: String!){
         obtenerUser_ByRut(rut: $rut) {
           rut
           type
           average
         }
     }
`;

const client = new ApolloClient({
    uri: 'https://apollo-server-cmp.herokuapp.com',
    cache: new InMemoryCache(),
});

const test = [
];

//var medic
//var current_rut
export default function ChartWeek({ }) {
    const [test, setTest] = useState([]);
    const [medic, setMedic] = useState(false)
    const [current_rut, setCurrentRut] = useState('')
    const { data } = useQuery(OBTENER_USUARIO_ACTUAL, {
        variables: {
            token: localStorage.getItem('token')
        }
    });
    const [inputRut, setInputRut] = useState('');
    
    useEffect(() => {
        if (data) {
            console.log(data)
            setMedic(data.obtenerUser.type === 'medico')
            setCurrentRut(data.obtenerUser.rut)
            client.query({
                query: obtenerRegistros_ByUserRut,
                variables: {
                    rut: data.obtenerUser.rut
                }
            }).then(resp => {
                resp.data.obtenerRegistros_ByUserRut.forEach(element => {
                    setTest(test => [...test, { name: element.fecha_creacion, Medicion: element.medicion, Prom_Recomendado: data.obtenerUser.average, amt: element.medicion }])
                });
                console.log(test)
            })
        }
    }, [data]);
    console.log(medic)
    const handleSubmit = () => {

        client.query({
            query: OBTENER_USUARIO_RUT,
            variables: {
                rut: inputRut
            }
        }).then(auxResp => {
            client.query({
                query: obtenerRegistros_ByUserRut,
                variables: {
                    rut: inputRut
                }
            }).then(resp => {
                setTest([])
                resp.data.obtenerRegistros_ByUserRut.forEach(element => {
                    setTest(test => [...test, { name: element.fecha_creacion, Medicion: element.medicion, Prom_Recomendado: auxResp.data.obtenerUser_ByRut.average, amt: element.medicion }])
                });
            })
        })



    }

    return (
        <>
            {medic && <input type="text" className="form-control" placeholder="Buscar rut" onChange={(e) => setInputRut(e.target.value)} />}
            {!medic && <input disabled type="text" className="form-control" placeholder={current_rut} onChange={(e) => setInputRut(e.target.value)} />}
            {medic && <button className="btn btn-primary" onClick={handleSubmit}>Buscar</button>}
            <LineChart key={`lc_${test.length}`}
                width={1100}
                height={400}
                data={test}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line key={`lc_${test.length}`}
                    type="monotone"
                    dataKey="Prom_Recomendado"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Medicion" stroke="#82ca9d" />
            </LineChart>
        </>

    );
}