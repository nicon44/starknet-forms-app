import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { FaCheck, FaShareAlt } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import { useFormContract } from "../hooks/useFormContract";
import responseToString from "../utils/responseToString";

interface FormRow {
  id: number;
  name: string;
  status: string;
}

const MyForms = () => {
  const { contract: test } = useFormContract();
  const { account } = useStarknet();

  const [myForms, setMyForms] = useState<FormRow[]>([]);
  const [shareModalId, setShareModalId] = useState<number | null>(null);

  const { data: myFormsResult } = useStarknetCall({
    contract: test,
    method: "view_my_forms",
    args: [account],
    options: { watch: true },
  });

  const { data, loading, error, reset, invoke } = useStarknetInvoke({
    contract: test,
    method: "forms_change_status_ready",
  });

  const { transactions } = useStarknetTransactionManager();
  console.log(transactions)

  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);

  useEffect(() => {
    setPendingTransactions(
      transactions.filter(
        (item: any) =>
          item.transaction &&
          item.transaction.type === 'INVOKE_FUNCTION' &&
          item.status &&
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
            id: +item.id,
            name: responseToString(item.name),
            status: responseToString(item.status),
          };
        });
        setMyForms(resultMap);
        return;
      }
    }
  }, [myFormsResult]);

  const readyHandler = (id: number) => () => {
    const payload = {
      args: [id],
    };
    invoke(payload).catch((e) => {
      alert("There was an error in the transaction");
    });
  };

  const showShareModal = (id: number) => () => {
    setShareModalId(id);
  };

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
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id={`tooltip-${item.id}`}>
                          Share form {item.id}
                        </Tooltip>
                      }
                    >
                      <Button onClick={showShareModal(item.id)}>
                        <FaShareAlt />
                      </Button>
                    </OverlayTrigger>
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
      {pendingTransactions.length > 0 && (
        <h4 className="mt-3">Pending transactions</h4>
      )}
      {pendingTransactions.map((transaction) => {
        return (
          <p key={transaction.transactionHash}>
            There's a pending transaction with status {transaction.status}
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
      <ShareModal
        id={shareModalId}
        show={!!shareModalId}
        onHide={() => setShareModalId(null)}
      />
    </>
  );
};

const ShareModal = (props: any) => {
  const link = window.location.origin + "/complete-form/" + props.id;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [link]);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(link);
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Share form {props.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form.Control type="text" value={link} disabled />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
        <Button onClick={handleCopy} disabled={copied} variant="primary">
          {copied ? "Copied" : "Copy link to clipboard"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyForms;
