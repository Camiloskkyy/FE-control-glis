import React from 'react'
import Sidebar from './Sidebar';
import Table from "./UserTable";

const Layout = ({children}) => {
    // Hook de routing

    return (
        <>
                <div className="bg-gray-200 min-h-screen">
                    <div className='flex min-h-screen'>
                        <Sidebar />

                        <main className='sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5'>
                            { children }
                            <Table />
                        </main>
                    </div>
                </div>
        </>
     );
}

export default Layout;