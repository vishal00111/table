import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableComponent = () => {
    const [userData, setUserData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user object
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'https://jsonplaceholder.typicode.com/users';
                const response = await axios.get(apiUrl);

                console.log('API Response:', response.data);

                // Extract headers dynamically from the first user object
                const firstUser = response.data.length > 0 ? response.data[0] : {};
                const keys = Object.keys(firstUser);
                setHeaders(keys);

                // Set user data
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const handleMasterCheckboxChange = () => {
        const allIds = userData.map(user => user.id);
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleCheckboxChange = (userId) => {
        const isSelected = selectedIds.includes(userId);
        if (isSelected) {
            setSelectedIds(selectedIds.filter(id => id !== userId));
            setSelectAll(false);
        } else {
            setSelectedIds([...selectedIds, userId]);
        }
    };

    const handleViewDetails = () => {
        // Find the user object in userData based on selected ID
        const user = userData.find(user => user.id === selectedIds[0]);
        setSelectedUser(user); // Set selected user object
        setModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal
    };

    return (
        <div className="py-8 px-4">
            <h2 className="text-2xl font-bold mb-4">User Data</h2>
            <div className="-mx-4 overflow-x-auto">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleMasterCheckboxChange}
                                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    />
                                </th>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {userData.map((user, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(user.id)}
                                            onChange={() => handleCheckboxChange(user.id)}
                                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                        />
                                    </td>
                                    {headers.map((header, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {header === 'address' ? (
                                                <div>
                                                    <p>Street: {user.address.street}</p>
                                                    <p>Suite: {user.address.suite}</p>
                                                    <p>City: {user.address.city}</p>
                                                    <p>Zipcode: {user.address.zipcode}</p>
                                                    <p>Geo: {user.address.geo.lat}, {user.address.geo.lng}</p>
                                                </div>
                                            ) : header === 'company' ? (
                                                <div>
                                                    <p>Name: {user.company.name}</p>
                                                    <p>Catch Phrase: {user.company.catchPhrase}</p>
                                                    <p>Business: {user.company.bs}</p>
                                                </div>
                                            ) : (
                                                user[header]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Button to view details */}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleViewDetails} // Open modal with selected user details
                disabled={selectedIds.length !== 1} // Disable button if more than one user is selected
            >
                View Details
            </button>

            {/* Modal for displaying user details */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-x-auto overflow-y-auto outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="bg-white rounded-lg shadow-lg border flex flex-col p-4">
                            <h3 className="text-lg font-semibold mb-4">User Details</h3>
                            {selectedUser && (
                                <div>
                                    <p>ID: {selectedUser.id}</p>
                                    <p>Name: {selectedUser.name}</p>
                                    <p>Username: {selectedUser.username}</p>
                                    <p>Email: {selectedUser.email}</p>
                                    <p>Phone: {selectedUser.phone}</p>
                                    <p>Website: {selectedUser.website}</p>
                                    <p>Address:</p>
                                    <p> - Street: {selectedUser.address.street}</p>
                                    <p> - Suite: {selectedUser.address.suite}</p>
                                    <p> - City: {selectedUser.address.city}</p>
                                    <p> - Zipcode: {selectedUser.address.zipcode}</p>
                                    <p> - Geo: {selectedUser.address.geo.lat}, {selectedUser.address.geo.lng}</p>
                                    <p>Company:</p>
                                    <p> - Name: {selectedUser.company.name}</p>
                                    <p> - Catch Phrase: {selectedUser.company.catchPhrase}</p>
                                    <p> - Business: {selectedUser.company.bs}</p>
                                </div>
                            )}
                            <div className="flex justify-end mt-4">
                                <button
                                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableComponent;














