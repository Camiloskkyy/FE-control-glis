import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef,onCellEditCommit } from '@mui/x-data-grid';
import { gql, useQuery,useApolloClient } from '@apollo/client';

var client
var row = [];
const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', width: 150},
    {
        field: 'rut',
        headerName: 'Rut',
        width: 150,
    },
    {
        field: 'type',
        headerName: 'Tipo',
        width: 90,
    },
    {
        field: 'average',
        headerName: 'Promedio (mg/dL)',
        type: 'string',
        width: 200,
        editable: true,
    }
];


const OBTENER_USERS = gql`
query obtenerUsers{
    obtenerUsers{
    name
    rut
    type
    average
}}`;

const ACTUALIZAR_USER = gql`
mutation actualizarUsuario($input: UsuarioInput) { 
    actualizarUsuario(input: $input){
        rut
        average
    }
}`;

function test(params){
    var average = parseInt(params.value);
    client.mutate({
        mutation: ACTUALIZAR_USER,
        variables: {
            input: {
                rut: params.row.rut,
                average: average
            }
        }}).then(res => {
            console.log(res)
        }
        ).catch(err => {
            console.log(err)
        })

}
export default function DataGridDemo() {
    const { data, loading } = useQuery(OBTENER_USERS);
    client = useApolloClient();
    if (loading) return <p>Loading...</p>;

    if(data){
        let i =0;
        data.obtenerUsers.forEach(element => {

            row.push({
                id: i,
                name: element.name,
                rut: element.rut,
                type: element.type,
                average: element.average

            })
            i++;
        }
        )
    }
    console.log(columns)

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[15]}
                checkboxSelection
                disableSelectionOnClick
                onCellEditCommit={(params: onCellEditCommit) => {
                    test(params)
                }}
            />
        </Box>
    );
}