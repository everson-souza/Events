"use client"

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { Grid, Switch } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { createEvent, editEvent } from "../api/event-api";
import { Event } from "@/shared/interfaces/event";

const EventDialog = ({
  evento,
  isOpen,
  closeDialog
}: {
  evento?: Event;
  isOpen: boolean;
  closeDialog: () => void;
}) => {

  
    
  // Form
  const { register, setValue, getValues, handleSubmit, formState: {errors} } = useForm<Event>({
    defaultValues: evento
      ? {
          id: evento.id,
          title: evento.title,
          date: evento.date,
          description: evento.description,
          duration: evento.duration,
          joiners: evento.joiners,
          location: evento.location,
          organizer: evento.organizer,
          status: evento.status
        }
      : undefined
  });

  const onSubmit: SubmitHandler<Event> = (infos: Event) => {    
    
    try{
      
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        alert('User not logged in');
        return;
      }
      infos.organizer_id =  Number.parseInt(userId)

      if (evento){
        editEvent(infos);
        alert(`Event ${infos.title} edited successfully`);
        closeDialog();
      } 
      else{
        infos.status = 1;
        createEvent(infos);
        alert(`Event ${infos.title} created successfully`);
        closeDialog();
      }
    } catch(e){
      console.log(e);
    }
  }

  return (
    isOpen && (
      <Dialog        
        open={isOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="xs"       
      > 
        <DialogTitle>{evento ? 'Edit Event' : 'Create Event'}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>     
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <input type="hidden" id="id" {...register("id", {shouldUnregister: true})} value={evento? evento.id : undefined}/>
                    <TextField
                        label="Event Title"
                        defaultValue={evento? evento.title : undefined}   
                        error={errors.title ? true : false}
                        helperText={errors.title ? errors.title?.message: ""}
                        {...register("title", {
                        shouldUnregister: true,
                        required: "Event title is required",
                        minLength: {
                            value: 10,
                            message: "Event title should be at least 10 characters",
                        },
                        maxLength: {
                            value: 255,
                            message: "Event title should be at most 255 characters",
                        },
                        })}
                        autoFocus
                        required
                        id="text"
                        fullWidth
                        variant="standard"            
                    />
                </Grid>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DateTimePicker
                            viewRenderers={{
                                hours: null,
                                minutes: null,
                                seconds: null,
                            }}
                            slotProps={{ textField: { fullWidth: true } }}
                            defaultValue={evento ? dayjs(evento.date) : undefined }
                            {...register("date", {                    
                                shouldUnregister: true,
                                valueAsDate:true,
                            })}                  
                            onChange={(date) => {
                                if (date) {
                                setValue('date', date.toDate());
                                }
                            }}
                            />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        defaultValue={evento? evento.description : undefined}   
                        error={errors.description ? true : false}
                        helperText={errors.description ? errors.description?.message: ""}
                        {...register("description", {
                            shouldUnregister: true,
                            required: "Event description is required",
                            minLength: {
                                value: 10,
                                message: "Event description should be at least 10 characters",
                            },
                        })}
                        multiline
                        rows={4}
                        fullWidth
                        />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Duration (in hours)"
                        type="number"
                        fullWidth
                        required
                        defaultValue={evento? evento.duration : undefined}   
                        error={errors.duration ? true : false}
                        helperText={errors.duration ? errors.duration?.message: ""}
                        {...register("duration", {
                            shouldUnregister: true,
                            required: "Event duration is required",                            
                        })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Location"
                        fullWidth
                        required
                        defaultValue={evento? evento.location : undefined}   
                        error={errors.location ? true : false}
                        helperText={errors.location ? errors.location?.message: ""}
                        {...register("location", {
                            shouldUnregister: true,
                            required: "Event location is required",                            
                        })}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit(onSubmit)} type="submit" variant='contained' size='medium'>Save</Button>
        </DialogActions>
      </Dialog>
    ));
  };

export default EventDialog;