import { Container, Image, Table } from "react-bootstrap"

import "./styles.scss"

export default function Matches() {
    const matches = [
        { against: "gapoulai", winner: "ldevilla", scores: [4, 5] },
        { against: "ckurt", winner: "ckurt", scores: [5, 2] }
    ]

    return (
        <Container>
            <h2>Matches</h2>
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
                    { matches.map((match) =>
                        <tr>
                            <td>
                                <Image src="/assets/42.jpg" height={50} width={50} roundedCircle className="me-3" />
                                { match.against }
                            </td>
                            <td>
                                <Image src="/assets/42.jpg" height={50} width={50} roundedCircle className="me-3" />
                                { match.winner }
                            </td>
                            <td>{ match.scores[0] }</td>
                            <td>{ match.scores[1] }</td>
                        </tr>
                    ) }
                </tbody>
            </Table>
        </Container>
    )
}
