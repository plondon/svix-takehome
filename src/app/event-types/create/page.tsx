"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const CreateEventTypePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleEventTypeCreate = async () => {
    setIsLoading(true);
    try {
      const result = await fetch("/api/svix/event-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });
      if (!result.ok) {
        throw await result.json();
      }
      router.push("/event-types");
    } catch (e: unknown) {
      const svixError = e as SvixErrorType["detail"];
      const message =
        typeof svixError === "string" ? svixError : svixError[0].msg;
      toast({
        title: "Error",
        description: (
          <>
            <span>Failed to create event type.</span>
            <br />
            <span> Response: {message}</span>
          </>
        ),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setName("");
      setDescription("");
    }
  };

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      handleEventTypeCreate();
    }
  };

  return (
    <Box>
      <Heading as="h1" size="md" mb={4}>
        Create Event Type
      </Heading>

      <form onSubmit={handleEventTypeCreate}>
        <Box>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            background="white"
            mb={4}
          />

          <Textarea
            value={description}
            background="white"
            onKeyPress={handleUserKeyPress}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            mb={4}
          />

          <Button
            colorScheme="blue"
            leftIcon={<AddIcon />}
            type="submit"
            onClick={handleEventTypeCreate}
            isLoading={isLoading}
          >
            Create
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateEventTypePage;
