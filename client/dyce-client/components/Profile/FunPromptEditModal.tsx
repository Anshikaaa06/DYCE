import React, { useEffect } from "react";
import InputModal from "../InputModal";
import TextInput from "../TextInput";
import { axiosClient } from "@/lib/axios-client";
import { toast } from "sonner";

const FUN_PROMPTS = {
  funPrompt1: "Ideal first date would be...",
  funPrompt2: "Chai or Coffee...",
  funPrompt3: "I can't stop talking about...",
};

const FunPromptEditModal = ({
  showModal,
  setShowModal,
  setProfileUpdated,

}: {
  showModal: {
    active: boolean;
    prompt: string | undefined;
    promptName: string;
  };
  setShowModal: React.Dispatch<
    React.SetStateAction<{
      active: boolean;
      prompt: string | undefined;
      promptName: string;
    }>
  >;
  setProfileUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [funPrompt, setFunPrompt] = React.useState(showModal.prompt ?? "");
  const handleSubmit = async () => {
    try {
      const name = showModal.promptName;
      const resp = await axiosClient.put("/profile", {
        [name]: funPrompt,
      });
      setShowModal((prev) => ({ ...prev, active: false }));
      setFunPrompt("");
      if (resp.status === 200) {
        toast.success("Prompt updated successfully!");
        setProfileUpdated(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update fun prompt.");
    }
  };
  
  useEffect(() => {
    setFunPrompt(showModal.prompt ?? "");
    // Reset the prompt when the modal is closed
    return () => {
      setFunPrompt("");
    };
  }, [showModal.prompt]);
  
  return (
    <>
      <InputModal
        title="Update Fun Prompts"
        description="Change your fun prompts."
        handleSubmit={handleSubmit}
        btnLabel="Update Fun Prompts"
        setShowModal={(active) => setShowModal((prev) => ({ ...prev, active }))}
        showModal={showModal.active}
      >

        <TextInput
          value={funPrompt}
          name="funPrompt"
          onChange={(e) => setFunPrompt(e.target.value)}
          label={
            FUN_PROMPTS[showModal.promptName as keyof typeof FUN_PROMPTS] ||
            "Fun Prompt"
          }
          placeholder="Enter your fun prompt"
        />
      </InputModal>
    </>
  );
};

export default FunPromptEditModal;
