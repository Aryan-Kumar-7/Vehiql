"use client";

import { bookTestDrive } from "@/actions/test-drive";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

// Define Zod schema for form validation
const testDriveSchema = z.object({
    date: z.date({
        required_error: "Please select a date for your test drive",
    }),
    timeSlot: z.string({
        required_error: "Please select a time slot",
    }),
    notes: z.string().optional(),
});


const TestDriveForm = ({ car, testDriveInfo }) => {

    const router = useRouter();
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    // Initialize react-hook-form with zod resolver
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(testDriveSchema),
        defaultValues: {
            date: undefined,
            timeSlot: undefined,
            notes: "",
        },
    });

    // Get dealership and booking information
    const dealership = testDriveInfo?.dealership;
    const existingBookings = testDriveInfo?.existingBookings || [];

    // Watch date field to update available time slots
    const selectedDate = watch("date");

    // Custom hooks for API calls
    const {
        loading: bookingInProgress,
        fn: bookTestDriveFn,
        data: bookingResult,
        error: bookingError,
    } = useFetch(bookTestDrive);

    // Handle successful booking
    useEffect(() => {
        if (bookingResult?.success) {
            setBookingDetails({
                date: format(bookingResult?.data?.bookingDate, "EEEE, MMMM d, yyyy"),
                timeSlot: `${format(
                    parseISO(`2022-01-01T${bookingResult?.data?.startTime}`),
                    "h:mm a"
                )} - ${format(
                    parseISO(`2022-01-01T${bookingResult?.data?.endTime}`),
                    "h:mm a"
                )}`,
                notes: bookingResult?.data?.notes,
            });
            setShowConfirmation(true);

            // Reset form
            reset();
        }
    }, [bookingResult, reset]);

    // Handle booking error
    useEffect(() => {
        if (bookingError) {
            toast.error(
                bookingError.message || "Failed to book test drive. Please try again."
            );
        }
    }, [bookingError]);

    // Update available time slots when date changes
    useEffect(() => {
        if (!selectedDate || !dealership?.workingHours) return;

        const selectedDayOfWeek = format(selectedDate, "EEEE").toUpperCase();

        // Find working hours for the selected day
        const daySchedule = dealership.workingHours.find(
            (day) => day.dayOfWeek === selectedDayOfWeek
        );

        if (!daySchedule || !daySchedule.isOpen) {
            setAvailableTimeSlots([]);
            return;
        }

        // Parse opening and closing hours
        const openHour = parseInt(daySchedule.openTime.split(":")[0]);
        const closeHour = parseInt(daySchedule.closeTime.split(":")[0]);

        // Generate time slots (every hour)
        const slots = [];
        for (let hour = openHour; hour < closeHour; hour++) {
            const startTime = `${hour.toString().padStart(2, "0")}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

            // Check if this slot is already booked
            const isBooked = existingBookings.some((booking) => {
                const bookingDate = booking.date;
                return (
                    bookingDate === format(selectedDate, "yyyy-MM-dd") &&
                    (booking.startTime === startTime || booking.endTime === endTime)
                );
            });

            if (!isBooked) {
                slots.push({
                    id: `${startTime}-${endTime}`,
                    label: `${startTime} - ${endTime}`,
                    startTime,
                    endTime,
                });
            }
        }

        setAvailableTimeSlots(slots);

        // Clear time slot selection when date changes
        setValue("timeSlot", "");
    }, [selectedDate]);

    // Create a function to determine which days should be disabled
    const isDayDisabled = (day) => {
        // Disable past dates
        if (day < new Date()) {
            return true;
        }

        // Get day of week
        const dayOfWeek = format(day, "EEEE").toUpperCase();

        // Find working hours for the day
        const daySchedule = dealership?.workingHours?.find(
            (schedule) => schedule.dayOfWeek === dayOfWeek
        );

        // Disable if dealership is closed on this day
        return !daySchedule || !daySchedule.isOpen;
    };

    // Submit handler
    const onSubmit = async (data) => {
        const selectedSlot = availableTimeSlots.find(
            (slot) => slot.id === data.timeSlot
        );

        if (!selectedSlot) {
            toast.error("Selected time slot is not available");
            return;
        }

        await bookTestDriveFn({
            carId: car.id,
            bookingDate: format(data.date, "yyyy-MM-dd"),
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            notes: data.notes || "",
        });
    };

    // Close confirmation handler
    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        router.push(`/cars/${car.id}`);
    };

    return (
        <div>TestDriveForm</div>
    )
}

export default TestDriveForm