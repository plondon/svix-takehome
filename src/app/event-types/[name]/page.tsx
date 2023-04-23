"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { EventTypeOut } from "svix";
import Link from "next/link";

const EventTypePage = ({ params }: { params: { name: string } }) => {
  const [eventType, setEventType] = useState<EventTypeOut>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchEventType = async () => {
      try {
        const result = await fetch(`/api/svix/event-types/${params.name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!result.ok) {
          throw await result.json();
        }
        const data = await result.json();
        setEventType(data);
      } catch (error) {
        console.error("Failed to fetch event types", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventType();
  }, [params.name]);

  const handleDescriptionChange = async () => {
    if (!descriptionRef.current) throw new Error("Missing new description.");
    const newEventType = {
      ...eventType,
      description: descriptionRef.current.value!,
    };
    try {
      setIsUpdating(true);
      const response = await fetch("/api/svix/event-types", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: params.name,
          description: newEventType.description,
        }),
      });
      if (!response.ok) {
        throw await response.json();
      }
      toast({
        title: "Success",
        description: "Description updated successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      // @ts-ignore
      setEventType(newEventType);
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: (e as Error).message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      handleDescriptionChange();
    }
  };

  return (
    <Box>
      <Heading as="h1" size="md" mb="6">
        <Link href={"/event-types"}>Event Types</Link>
        {` > Event Type`}
      </Heading>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <Box>
          <Heading mb="2" as="h3" size="md">
            {eventType?.name}
          </Heading>
          <Table
            background={"white"}
            rounded="md"
            overflow={"hidden"}
            border="1px"
            borderColor="gray.300"
          >
            <Thead>
              <Tr background="gray.200">
                <Th
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  Description{" "}
                  {isEditing ? (
                    <Flex>
                      <Button
                        isLoading={isUpdating}
                        colorScheme="green"
                        type="submit"
                        size="xs"
                        onClick={() => handleDescriptionChange()}
                      >
                        Save
                      </Button>
                      <Button
                        ml="2"
                        size="xs"
                        colorScheme="red"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Flex>
                  ) : (
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr
                _hover={{
                  background: "gray.50",
                }}
              >
                <Td fontSize="sm">
                  {isEditing ? (
                    <Textarea
                      background="white"
                      ref={descriptionRef}
                      onKeyPress={handleUserKeyPress}
                      defaultValue={eventType?.description}
                    ></Textarea>
                  ) : (
                    eventType?.description
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default EventTypePage;
