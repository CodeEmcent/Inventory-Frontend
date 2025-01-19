import React, { useState, useEffect } from 'react';
import API from './apiService'; // Your axios setup

const InventoryTable = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/api/inventory/?page=${page}`);
                setData(response.data.results); // Assuming pagination format { results: [], count: total }
                setTotalPages(Math.ceil(response.data.count / 10)); // Adjust page size as needed
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        fetchData();
    }, [page]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button onClick={() => console.log('Edit:', item.id)}>Edit</button>
                                <button onClick={() => console.log('Delete:', item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default InventoryTable;
