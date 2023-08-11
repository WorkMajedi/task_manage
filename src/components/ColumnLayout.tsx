/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useDispatch } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { StoreDispatch } from '../redux/store';
import { IColumnLayoutProps } from '../types';
import { styles } from './style';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ColumnLayout: React.FC<IColumnLayoutProps> = ({
  labelText,
  addHandler,
  removeHandler,
  completedHandler,
  selectorState,
  droppableId,
  updateTextShowed,
}) => {
  const [isError, setIsError] = useState({
    isShow: false,
    text: '',

  });

  const [textDescription, setTextDescription] = useState('');
  const [titleDescription, setTitleDescription] = useState('');
  const dispatch = useDispatch<StoreDispatch>();

  const handleOnChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTextDescription(value);

    setIsError({
      isShow: value.length > 200,
      text:
        value.length > 200
          ? 'The input value cannot be more than 200 characters'
          : '',
    });
  };
  const handleOnChangeTitle = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitleDescription(value);

    setIsError({
      isShow: value.length > 200,
      text:
        value.length > 200
          ? 'The input value cannot be more than 200 characters'
          : '',
    });
  };

  const handleOnBlur = () => {
    setIsError({ ...isError, isShow: false });
  };

  const handleOnClick = () => {
    if (!isError.isShow) {
      dispatch(addHandler(textDescription , titleDescription));
      setTextDescription('');
      setTitleDescription('')
    }
  };

  const handleInputKeyDown = ({
    target,
    key,
  }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      if (
        (target as HTMLInputElement).value.length > 0 &&
        (target as HTMLInputElement).value.length <= 200
      ) {
        handleOnClick();
      } else {
        setIsError({
          isShow: true,
          text: 'The input value cannot be empty',
        });
      }
    }
  };

  return (
    <Box borderRadius={1} width='100%' sx={{ boxShadow: 2, p: 3 }}>
      <TextField
          fullWidth
          label={labelText}
          onChange={handleOnChangeTitle}
          onBlur={handleOnBlur}
          onKeyDown={handleInputKeyDown}
          value={titleDescription}
          variant='outlined'
          size='small'
          css={styles.textField}
      />
      <TextField
        fullWidth
        label={"description "}
        multiline
        rows={3}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onKeyDown={handleInputKeyDown}
        value={textDescription}
        variant='outlined'
        size='small'
      />

      <Collapse in={isError.isShow}>
        <Alert severity='error' sx={{ my: 1 }}>
          {isError.text}
        </Alert>
      </Collapse>

      <Box width='100%' display='flex' justifyContent='center'>
        <Button
          size='medium'
          variant='outlined'
          color='primary'
          fullWidth
          onClick={handleOnClick}
          onKeyDown={({ key }) => key === 'Enter' && handleOnClick()}
          disabled={
            textDescription.length === 0 || textDescription.length > 200
          }
          css={styles.addButton}
        >
          Add Item
        </Button>
      </Box>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <List
            sx={{
              minHeight: '300px',
              li: {
                flexDirection: 'column',
              },
              '& .MuiListItemText-root': {
                width: '100%',
              },
            }}
            ref={provided.innerRef}
            {...provided?.droppableProps}
          >
            {selectorState.map(
              (
                { id, text, isFinished, createdAt, updatedAt, isTextShowed , title },
                index: number
              ) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => 
                    <Accordion 
                      css={styles.accordion}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                  >
                    <AccordionSummary  
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            textDecoration: isFinished ? 'line-through' : 'none',
                            wordBreak: 'break-word',
                        }}
                    >
                          <Box
                            component='span'
                            width='100%'
                            position='absolute'
                            top='0'
                            fontSize='.7rem'
                            marginLeft='10px'
                            marginTop= '4px'
                          >
                            {updatedAt ? 'Updated' : 'Created'} at:{' '}
                            {updatedAt || createdAt}
                          </Box>

                          {title && <Box component='div' css={styles.titleBox}>
                            {title}
                          </Box>}

                          <Box display='flex' component='span'>
                            <IconButton
                              onClick={() => dispatch(removeHandler(id))}
                            >
                              <DeleteIcon
                                sx={{
                                  color: snapshot.isDragging ? '#fff' : '#000',
                                }}
                              />
                            </IconButton>
                            <Checkbox
                              edge='end'
                              value={isFinished}
                              checked={isFinished}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                color: isFinished? 'green' : '#55555582'
                                }
                            }}
                              inputProps={{ 'aria-label': 'controlled' }}
                              onChange={() =>
                                dispatch(
                                  completedHandler({
                                    isFinished: !isFinished,
                                    id,
                                    updatedAt: new Date().toLocaleString(),
                                  })
                                )
                              }
                            />
                          </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box component='div' css={styles.textBox}>
                        {text}
                      </Box>
                    </AccordionDetails>
                  </Accordion>                    
                  }
                </Draggable>
              )
            )}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Box>
  );
};

export default ColumnLayout;
