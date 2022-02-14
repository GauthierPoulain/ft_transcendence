import "./style.css"
import { Table } from "react-bootstrap"

function Matches() {
    return (
        <div className="matchesContainer">
            <h1 className="title">MATCHES</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Against</th>
                        <th>Winner</th>
                        <th>Opponent score</th>
                        <th>Your score</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <img
                                className="imgMatches"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            gapoulai
                        </td>
                        <td>
                            <img
                                className="imgMatches"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            ldevilla
                        </td>
                        <td>4</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>
                            <img
                                className="imgMatches"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            ckurt
                        </td>
                        <td>
                            <img
                                className="imgMatches"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            ckurt
                        </td>
                        <td>5</td>
                        <td>2</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Matches
