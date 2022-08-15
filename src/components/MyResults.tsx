import {
  useStarknet,
  useStarknetCall,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import { TailSpin } from "react-loader-spinner";
import { useFormContract } from "../hooks/useFormContract";
import responseToString from "../utils/responseToString";
import "./MyForms.css";

interface FormRow {
  id: number;
  name: string;
  score: number;
}

const MyResults = () => {
  const { contract: test } = useFormContract();
  const { account } = useStarknet();

  const [myForms, setMyForms] = useState<FormRow[]>([]);

  const { data: myFormsResult } = useStarknetCall({
    contract: test,
    method: "view_my_score_forms_completed",
    args: [account],
    options: { watch: true },
  });

  const { transactions } = useStarknetTransactionManager();

  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);

  useEffect(() => {
    setPendingTransactions(
      transactions.filter(
        (item: any) =>
          item.transaction &&
          item.transaction.type === "INVOKE_FUNCTION" &&
          item.status &&
          item.status !== "ACCEPTED_ON_L1" &&
          item.status !== "ACCEPTED_ON_L2" &&
          item.status !== "REJECTED"
      )
    );
  }, [transactions]);

  useMemo(() => {
    if (myFormsResult && myFormsResult.length > 0) {
      if (myFormsResult[0] instanceof Array) {
        const resultMap = myFormsResult[0].map((item) => {
          return {
            id: +item.id_form,
            name: responseToString(item.nickname),
            score: +item['score']?.toString(10),
          };
        });
        setMyForms(resultMap);
        return;
      }
    }
  }, [myFormsResult]);

  return (
    <>
      <h3>My Results</h3>
      {myForms.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {myForms.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.score}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p className="mt-3">
          No results found. Go to 'Complete form' to complete one.
        </p>
      )}
      {pendingTransactions.length > 0 && (
        <h4 className="mt-3">Pending transactions</h4>
      )}
      {pendingTransactions.map((transaction) => {
        return (
          <p key={transaction.transactionHash}>
            There is an unfinished transaction with status {transaction.status}
          </p>
        );
      })}
      {pendingTransactions.length > 0 && (
        <TailSpin
          height="25"
          width="25"
          radius="9"
          color="black"
          ariaLabel="loading"
        />
      )}
    </>
  );
};

export default MyResults;
