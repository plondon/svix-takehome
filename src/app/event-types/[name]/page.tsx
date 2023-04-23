"use client";

import { useState, useEffect, useRef } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { EventTypeOut } from "svix";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EventTypePage = ({ params }: { params: { name: string } }) => {
  const [eventType, setEventType] = useState<EventTypeOut>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();
  const router = useRouter();

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
    if (!eventType) throw new Error("Missing event type.");
    const newEventType: EventTypeOut = {
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
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleDescriptionChange();
    }
  };

  const handleDeleteEventType = async (name: string) => {
    const confirm = window.confirm(
      `Are you sure you want to delete event type ${name}?`
    );
    if (!confirm) return;
    try {
      const result = await fetch(`/api/svix/event-types/${name}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!result.ok) {
        throw await result.json();
      }
      router.push("/event-types");
    } catch (error) {
      const svixError = error as SvixErrorType["detail"];
      const message =
        typeof svixError === "string" ? svixError : svixError[0].msg;
      toast({
        title: "Error",
        description: (
          <>
            <span>Failed to delete event type.</span>
            <br />
            <span> Response: {message}</span>
          </>
        ),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading as="h1" size="md" mb="6">
        <Link style={{ textDecoration: "underline" }} href={"/event-types"}>
          Event Types
        </Link>
        {` > Event Type`}
      </Heading>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <>
          <Box width="50%">
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
                      <Flex>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          ml="2"
                          size="xs"
                          colorScheme="red"
                          onClick={() => handleDeleteEventType(eventType?.name!)}
                        >
                          Delete
                        </Button>
                      </Flex>
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
          <Box mt={4}>
            <Box
              paddingBottom={3}
              paddingTop={2}
              borderBottom={"1px solid"}
              borderColor={"gray.200"}
            >
              <Text fontWeight={"bold"} fontSize={"sm"} mb={1}>
                Archived
              </Text>
              <Badge colorScheme="green">
                {eventType?.archived?.toString()}
              </Badge>
            </Box>
          </Box>
          <Box
            paddingBottom={3}
            paddingTop={2}
            borderBottom={"1px solid"}
            borderColor={"gray.200"}
          >
            <Text fontWeight={"bold"} fontSize={"sm"} mb={1}>
              Created
            </Text>
            <Badge colorScheme="green">
              {new Date(eventType?.createdAt!).toLocaleString()}
            </Badge>
          </Box>
          <Box
            paddingBottom={3}
            paddingTop={2}
            borderBottom={"1px solid"}
            borderColor={"gray.200"}
          >
            <Text fontWeight={"bold"} fontSize={"sm"} mb={1}>
              Last Updated
            </Text>
            <Badge colorScheme="green">
              {new Date(eventType?.updatedAt!).toLocaleString()}
            </Badge>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EventTypePage;
