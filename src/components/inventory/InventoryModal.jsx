import React, { useState } from 'react';

const InventoryModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
    const [name, setName] = useState(initialData.name || '');
    const [quantity, setQuantity] = useState(initialData.quantity || '');

    const handleSave = () => {
        onSave({ name, quantity });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{initialData.id ? 'Edit Item' : 'Add Item'}</h2>
                <form>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </label>
                    <button type="button" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InventoryModal;
