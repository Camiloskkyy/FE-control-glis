import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { gql, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';


const OBTENER_USUARIO_ACTUAL = gql`
query obtenerUser ($token: String!){
    obtenerUser(token: $token) {
      rut
      average
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

const client = new ApolloClient({
    uri: 'http://192.168.100.100:4000',
    cache: new InMemoryCache(),
});

const test = [
];

// export default class ChartWeek extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';

//   render() {
//     client.query({
//         query: OBTENER_USUARIO_ACTUAL,
//         variables: {
//             token: localStorage.getItem('token')
//         }
//     }).then(res => {
//         client.query({
//             query: obtenerRegistros_ByUserRut,
//             variables:  {
//                 Rut: res.data.obtenerUser.rut
//             }}).then(resp => {
//                 // console.log(res)
//                 resp.data.obtenerRegistros_ByUserRut.forEach(registro => {    
//                     //console.log(registro)
//                     data.push({name: registro.fecha_creacion, Medicion: registro.medicion,Prom_Recomendado:res.data.obtenerUser.average,amt:registro.medicion})
//                 })
//             })
//     })

//   }
// }

export default function ChartWeek() {
    const [test, setTest] = useState([]);

    const { data } = useQuery(OBTENER_USUARIO_ACTUAL, {
        variables: {
            token: localStorage.getItem('token')
        }
    });


    useEffect(() => {
        if (data) {
            client.query({
                query: obtenerRegistros_ByUserRut,
                variables: {
                    rut: data.obtenerUser.rut
                }
            }).then(resp => {
                let aux =resp.data.obtenerRegistros_ByUserRut
                console.log(aux)

                resp.data.obtenerRegistros_ByUserRut.forEach(element => {

                    setTest(test => [...test, { name: element.fecha_creacion, Medicion: element.medicion, Prom_Recomendado: data.obtenerUser.average, amt: element.medicion }])
                });

            })
        }
    }, [data]);


    return (
        <LineChart key={`lc_${test.length}`}
            width={500}
            height={300}
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
    );
}