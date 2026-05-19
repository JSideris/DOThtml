import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { buildData } from '../shared/data-generator';

const BenchmarkApp = () => {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);

    const run = useCallback(() => {
        setData(buildData(1000));
        setSelected(null);
    }, []);

    const runLots = useCallback(() => {
        setData(buildData(10000));
        setSelected(null);
    }, []);

    const add = useCallback(() => {
        setData(prev => [...prev, ...buildData(1000)]);
    }, []);

    const update = useCallback(() => {
        setData(prev => {
            const newData = [...prev];
            for (let i = 0; i < newData.length; i += 10) {
                newData[i] = { ...newData[i], label: newData[i].label + ' !!!' };
            }
            return newData;
        });
    }, []);

    const clear = useCallback(() => {
        setData([]);
        setSelected(null);
    }, []);

    const swapRows = useCallback(() => {
        setData(prev => {
            if (prev.length > 998) {
                const newData = [...prev];
                const temp = newData[1];
                newData[1] = newData[998];
                newData[998] = temp;
                return newData;
            }
            return prev;
        });
    }, []);

    const select = useCallback((id) => {
        setSelected(id);
    }, []);

    const remove = useCallback((id) => {
        setData(prev => prev.filter(d => d.id !== id));
    }, []);

    return (
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6"><h1>React</h1></div>
                    <div className="col-md-6">
                        <div className="row">
                            <button id="run" className="btn btn-primary" onClick={run}>Create 1,000 rows</button>
                            <button id="runlots" className="btn btn-primary" onClick={runLots}>Create 10,000 rows</button>
                            <button id="add" className="btn btn-primary" onClick={add}>Append 1,000 rows</button>
                            <button id="update" className="btn btn-primary" onClick={update}>Update every 10th row</button>
                            <button id="clear" className="btn btn-primary" onClick={clear}>Clear</button>
                            <button id="swaprows" className="btn btn-primary" onClick={swapRows}>Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody>
                    {data.map(d => (
                        <tr key={d.id} className={selected === d.id ? 'selected' : ''}>
                            <td className="col-md-1">{d.id}</td>
                            <td className="col-md-4">
                                <a onClick={() => select(d.id)}>{d.label}</a>
                            </td>
                            <td className="col-md-1">
                                <a onClick={() => remove(d.id)}>
                                    <span className="glyphicon glyphicon-remove danger" aria-hidden="true">x</span>
                                </a>
                            </td>
                            <td className="col-md-6"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('app')).render(<BenchmarkApp />);
