import { useStarknet, useStarknetCall } from "@starknet-react/core";
import { useMemo, useState } from "react";
import { useFormContract } from "../hooks/useFormContract";
import responseToString from "../utils/responseToString";
import Table from "react-bootstrap/Table";
import { FaCheck } from "react-icons/fa";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

interface FormRow {
  id: number;
  name: string;
  status: string;
}

const MyForms = () => {
  const { contract: test } = useFormContract();
  const { account } = useStarknet();

  const [myForms, setMyForms] = useState<FormRow[]>([]);

  const { data: myFormsResult } = useStarknetCall({
    contract: test,
    method: "view_my_forms",
    args: [account],
    options: { watch: true },
  });

  useMemo(() => {
    if (myFormsResult && myFormsResult.length > 0) {
      if (myFormsResult[0] instanceof Array) {
        console.log(myFormsResult);
        const resultMap = myFormsResult[0].map((item) => {
          return {
            id: +item.id,
            name: responseToString(item.name),
            status: responseToString(item.status),
          };
        });
        setMyForms(resultMap);
        console.log("result map", resultMap);
        return;
      }
    }
  }, [myFormsResult]);

  const readyHandler = (id: number) => () => {};

  return (
    <>
      <h3>My forms</h3>
      {myForms.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myForms.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.status === "OPEN" && (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id={`tooltip-${item.id}`}>
                            Set form {item.id} to READY
                          </Tooltip>
                        }
                      >
                        <Button
                          variant="success"
                          onClick={readyHandler(item.id)}
                        >
                          <FaCheck />
                        </Button>
                      </OverlayTrigger>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p className="mt-3">
          No forms found. Go to 'Create form' to create one.
        </p>
      )}
    </>
  );
};

export default MyForms;
