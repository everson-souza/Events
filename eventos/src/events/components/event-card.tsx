import * as React from 'react';
import { useState } from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Event } from '@/shared/interfaces/event';
import { formatDate } from '@/shared/utils/date';
import EventDialog from './event-dialog';
import { BullComponent } from '@/shared/components/bull';
import { EventType } from '@/shared/types/eventType';
import { deleteEvent, editEvent, joinEvent, removeEvent } from '../api/event-api';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from 'material-ui-confirm';

export default function EventCard({
    evento,
    type
  }: {
    evento: Event;    
    type: EventType
  }) {

  // DIALOG FUNCTIONS  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openDialog = () => {
    if (type == 'organized')
      setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const join = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const userId = localStorage.getItem('user_id');

    if (userId){
      if (type == 'joined'){
        removeEvent(evento.id, parseInt(userId))
      }
      else
        joinEvent(evento.id, parseInt(userId))
    }
  }

  const confirm = useConfirm();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    confirm({ description: `Are you sure you want to delete the event ${evento.title}?` })
    .then(() => {
      evento.status = 2; //Set event to canceled
      editEvent(evento);
    });
  };


  return (
    <div>
      <EventDialog          
        isOpen={isDialogOpen}
        evento={evento}
        closeDialog={closeDialog}
      />

      <Card onClick={openDialog} sx={{ maxWidth: 345 }} >
      
        <CardHeader 
          sx={{paddingBottom: '0px'}}
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {evento.title.charAt(0).toUpperCase()}
            </Avatar>
          }          
          title={evento.title}
          subheader={formatDate(evento.date)}        
        />
        <CardContent sx={{ paddingTop: 0 }}>
          <p className='card-info'>
              {evento.organizer?.name} {BullComponent} {evento.duration}
          </p>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {evento.description}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton className='icon-button' color={type === 'joined' ? 'error' : 'default'} aria-label="join" onClick={join}> 
            <FavoriteIcon/> 
          </IconButton>
          {type === 'organized' && <IconButton aria-label="share" onClick={handleDelete}> <DeleteIcon/> </IconButton>}
        </CardActions>
      </Card>
    </div>
   
  );
}