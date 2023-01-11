import React, { useState, useEffect } from "react";
import { gql } from '@apollo/client';
import ModalRegistro from './ModalRegistro';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalUser from './ModalUser';
import { useQuery } from '@apollo/client';



const Sidebar = (data) => {
    const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [type, setType] = useState(false)

    useEffect(() => {
        if (data.data !== undefined) {
            setType(data.data.obtenerUser.type === "medico")
        }
    }, [data.data])




    return (

        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="text-white text-2xl font-black">Ctrl Glis</p>
            </div>

            <nav className="mt-5 list-none">
                {<Button onClick={() => setSmShow(true)}>Agregar Registro</Button>}
                <li>

                    <Modal
                        size="sm"
                        show={smShow}
                        onHide={() => setSmShow(false)}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header closeButton>
                            <h4 className="w-100 text-center">Agregar Registro</h4>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalRegistro setSmShow={setSmShow} />
                        </Modal.Body>
                    </Modal>
                </li>
                <li className="pt-3">
                    {type && <Button onClick={() => setLgShow(true)}>Agregar Usuario</Button>}
                    <Modal
                        size="sm"
                        show={lgShow}
                        onHide={() => setLgShow(false)}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header closeButton>
                            <h4 className="w-100 text-center">Agregar Usuario</h4>
                        </Modal.Header>
                        <Modal.Body>
                            <ModalUser setLgShow={setLgShow} />
                        </Modal.Body>
                    </Modal>
                </li>
            </nav>

        </aside>
    );
}

export default Sidebar;