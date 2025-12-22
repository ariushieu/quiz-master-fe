import React from 'react';

const TableBuilder = ({ tableStructure, onChange }) => {
    const { headers = ['Column 1', 'Column 2'], rows = [] } = tableStructure || {};

    const updateHeaders = (newHeaders) => {
        onChange({ ...tableStructure, headers: newHeaders });
    };

    const updateHeader = (index, value) => {
        const newHeaders = [...headers];
        newHeaders[index] = value;
        updateHeaders(newHeaders);
    };

    const addColumn = () => {
        const newHeaders = [...headers, `Column ${headers.length + 1}`];
        const newRows = rows.map(row => ({
            cells: [...row.cells, { type: 'text', value: '' }]
        }));
        onChange({ headers: newHeaders, rows: newRows });
    };

    const removeColumn = (colIndex) => {
        if (headers.length <= 1) {
            alert('Table must have at least 1 column');
            return;
        }
        const newHeaders = headers.filter((_, i) => i !== colIndex);
        const newRows = rows.map(row => ({
            cells: row.cells.filter((_, i) => i !== colIndex)
        }));
        onChange({ headers: newHeaders, rows: newRows });
    };

    const addRow = () => {
        const newRow = {
            cells: headers.map(() => ({ type: 'text', value: '' }))
        };
        onChange({ ...tableStructure, rows: [...rows, newRow] });
    };

    const removeRow = (rowIndex) => {
        if (rows.length <= 1) {
            alert('Table must have at least 1 row');
            return;
        }
        const newRows = rows.filter((_, i) => i !== rowIndex);
        onChange({ ...tableStructure, rows: newRows });
    };

    const updateCell = (rowIndex, cellIndex, updates) => {
        const newRows = [...rows];
        newRows[rowIndex].cells[cellIndex] = {
            ...newRows[rowIndex].cells[cellIndex],
            ...updates
        };
        onChange({ ...tableStructure, rows: newRows });
    };

    const updateCellType = (rowIndex, cellIndex, newType) => {
        const cell = rows[rowIndex].cells[cellIndex];
        if (newType === 'blank') {
            updateCell(rowIndex, cellIndex, {
                type: 'blank',
                blankId: 1,
                answer: '',
                value: undefined
            });
        } else {
            updateCell(rowIndex, cellIndex, {
                type: 'text',
                value: cell.answer || '',
                blankId: undefined,
                answer: undefined
            });
        }
    };

    return (
        <div style={{ marginTop: '16px' }}>
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '12px',
                flexWrap: 'wrap'
            }}>
                <button
                    type="button"
                    onClick={addRow}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    + Add Row
                </button>
                <button
                    type="button"
                    onClick={addColumn}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    + Add Column
                </button>
            </div>

            <div style={{ 
                overflowX: 'auto', 
                marginBottom: '12px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--border) transparent'
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    fontSize: '0.85rem',
                    minWidth: '700px',
                    border: '2px solid var(--border)'
                }}>
                    <thead>
                        <tr>
                            {headers.map((header, idx) => (
                                <th key={idx} style={{
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    padding: '12px 10px',
                                    borderRight: idx < headers.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                    position: 'relative',
                                    verticalAlign: 'middle'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <input
                                            type="text"
                                            value={header}
                                            onChange={(e) => updateHeader(idx, e.target.value)}
                                            placeholder="Header"
                                            style={{
                                                flex: 1,
                                                padding: '6px 10px',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                background: '#fff',
                                                color: '#000',
                                                fontWeight: '600'
                                            }}
                                        />
                                        {headers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeColumn(idx)}
                                                style={{
                                                    background: '#ef4444',
                                                    border: 'none',
                                                    color: '#fff',
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th style={{
                                background: 'var(--bg-surface)',
                                padding: '12px 10px',
                                width: '80px',
                                borderLeft: '1px solid var(--border)',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{
                                background: rIdx % 2 === 0 ? 'var(--bg-elevated)' : 'var(--bg-surface)'
                            }}>
                                {row.cells.map((cell, cIdx) => (
                                    <td key={cIdx} style={{
                                        padding: '12px 10px',
                                        border: '1px solid var(--border)',
                                        verticalAlign: 'top',
                                        minWidth: '150px'
                                    }}>
                                        <div style={{ marginBottom: '8px' }}>
                                            <select
                                                value={cell.type}
                                                onChange={(e) => updateCellType(rIdx, cIdx, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '6px 8px',
                                                    fontSize: '0.8rem',
                                                    borderRadius: '6px',
                                                    border: '2px solid',
                                                    borderColor: cell.type === 'blank' ? '#6366f1' : 'var(--border)',
                                                    background: cell.type === 'blank' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-base)',
                                                    color: 'var(--text-primary)',
                                                    fontWeight: cell.type === 'blank' ? '600' : '400',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="text">Fixed Text</option>
                                                <option value="blank">Blank (Answer)</option>
                                            </select>
                                        </div>

                                        {cell.type === 'text' ? (
                                            <textarea
                                                value={cell.value || ''}
                                                onChange={(e) => updateCell(rIdx, cIdx, { value: e.target.value })}
                                                placeholder="Enter cell content..."
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    fontSize: '0.9rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid var(--border)',
                                                    background: 'var(--bg-base)',
                                                    color: 'var(--text-primary)',
                                                    minHeight: '70px',
                                                    resize: 'vertical',
                                                    lineHeight: '1.5'
                                                }}
                                            />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div>
                                                    <label style={{ 
                                                        display: 'block', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: '600', 
                                                        marginBottom: '4px',
                                                        color: 'var(--text-secondary)'
                                                    }}>
                                                        Question Number
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={cell.blankId || ''}
                                                        onChange={(e) => updateCell(rIdx, cIdx, { blankId: parseInt(e.target.value) || 1 })}
                                                        placeholder="1"
                                                        min="1"
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px 10px',
                                                            fontSize: '0.9rem',
                                                            borderRadius: '6px',
                                                            border: '2px solid #6366f1',
                                                            background: 'var(--bg-base)',
                                                            color: 'var(--text-primary)',
                                                            fontWeight: '600',
                                                            textAlign: 'center'
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ 
                                                        display: 'block', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: '600', 
                                                        marginBottom: '4px',
                                                        color: 'var(--text-secondary)'
                                                    }}>
                                                        Correct Answer
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cell.answer || ''}
                                                        onChange={(e) => updateCell(rIdx, cIdx, { answer: e.target.value })}
                                                        placeholder="Enter answer..."
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px 10px',
                                                            fontSize: '0.9rem',
                                                            borderRadius: '6px',
                                                            border: '2px solid #22c55e',
                                                            background: 'var(--bg-base)',
                                                            color: 'var(--text-primary)',
                                                            fontWeight: '500'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                ))}
                                <td style={{
                                    padding: '12px 10px',
                                    border: '1px solid var(--border)',
                                    textAlign: 'center',
                                    verticalAlign: 'middle'
                                }}>
                                    {rows.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRow(rIdx)}
                                            style={{
                                                background: '#ef4444',
                                                border: 'none',
                                                color: '#fff',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{
                padding: '12px',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
                <strong>Tips:</strong>
                <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                    <li>Use "Fixed Text" for cells that are already filled</li>
                    <li>Use "Blank (Answer)" for cells students need to complete</li>
                    <li>Assign unique question numbers (Q#) to each blank</li>
                    <li>Enter the correct answer for each blank</li>
                </ul>
            </div>
        </div>
    );
};

export default TableBuilder;
