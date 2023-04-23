"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { EventTypeOut } from "svix";
import { useRouter } from "next/navigation";
import { AddIcon } from "@chakra-ui/icons";
import Link from "next/link";

const EventTypesPage = () => {
  const [eventTypes, setEventTypes] = useState<EventTypeOut[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iterator, setIterator] = useState<string | null>(null);
  const [nextIterator, setNextIterator] = useState<string | null>(null);
  const [prevIterator, setPrevIterator] = useState<string | null>(null);
  const [firstEventType, setFirstEventType] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const result = await fetch(
          `/api/svix/event-types${iterator ? `?iterator=${iterator}` : ``}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!result.ok) {
          throw await result.json();
        }
        const data = await result.json();
        setEventTypes(data.data);
        setNextIterator(data.iterator);
        setPrevIterator(data.prevIterator);
        setIsDone(data.done);
        if (!firstEventType && !iterator) {
          setFirstEventType(data.data[0].name);
        }
        if (firstEventType === data.data[0].name || !iterator) {
          setPrevIterator(null);
          setIsDone(false);
        }
      } catch (error) {
        const svixError = error as SvixErrorType["detail"];
        const message =
          typeof svixError === "string" ? svixError : svixError[0].msg;
        toast({
          title: "Error",
          description: (
            <>
              <span>Failed to fetch event types.</span>
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
      }
    };

    fetchEventTypes();
  }, [iterator, toast]);

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
      setEventTypes(eventTypes.filter((eventType) => eventType.name !== name));
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
      <Heading
        as="h1"
        size="md"
        mb="6"
        display={"flex"}
        justifyContent={"space-between"}
      >
        Event Types
        <Link href="/event-types/create">
          <Button leftIcon={<AddIcon />} colorScheme="blue">
            Create Event Type
          </Button>
        </Link>
      </Heading>
      <Heading as="h2" size="xs" mb="4">
        Your event types are only available to users within the App Portal. If
        you would like to make your event types served publicly, you should
        configure your Event Catalog settings.
      </Heading>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <>
          <Table
            background={"white"}
            rounded="md"
            overflow={"hidden"}
            border="1px"
            borderColor="gray.300"
          >
            <Thead>
              <Tr background="gray.200">
                <Th>Name</Th>
                <Th>Description</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {eventTypes.map((eventType) => (
                <Tr
                  css={{ cursor: "pointer" }}
                  key={eventType.name}
                  _hover={{
                    background: "gray.50",
                  }}
                  onClick={() => {
                    router.push(`/event-types/${eventType.name}`);
                  }}
                >
                  <Td fontSize={"sm"}>{eventType.name}</Td>
                  <Td fontSize={"sm"}>{eventType.description}</Td>
                  <Td display={"flex"} justifyContent={"flex-end"}>
                    <Button
                      ml="2"
                      size="xs"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEventType(eventType?.name!);
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex gap={2} mt={4} justifyContent={"end"}>
            <Button
              isDisabled={!prevIterator}
              size={"xs"}
              colorScheme="blackAlpha"
              onClick={() => {
                setIterator(prevIterator);
              }}
            >
              Prev
            </Button>
            <Button
              isDisabled={isDone}
              size={"xs"}
              colorScheme="blackAlpha"
              onClick={() => {
                setIterator(nextIterator);
              }}
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default EventTypesPage;
