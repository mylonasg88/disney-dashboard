import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedCharacter } from '../../store/slices/charactersSlice';

const CharacterModal: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const selectedCharacter = useAppSelector((state) => state.characters.selectedCharacter);

  const handleClose = () => {
    dispatch(setSelectedCharacter(null));
  };

  if (!selectedCharacter) {return null;}

  return (
    <Dialog
      open={!!selectedCharacter}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={selectedCharacter.imageUrl}
            alt={selectedCharacter.name}
            sx={{ width: 80, height: 80 }}
          >
            {selectedCharacter.name?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="h4" component="div">
            {selectedCharacter.name || 'Unknown Character'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {selectedCharacter.imageUrl && (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={selectedCharacter.imageUrl}
                alt={selectedCharacter.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              TV Shows
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {selectedCharacter.tvShows && selectedCharacter.tvShows.length > 0 ? (
              <List dense>
                {selectedCharacter.tvShows.map((show) => (
                  <ListItem key={`${selectedCharacter._id}-show-${show}`}>
                    <Chip label={show} sx={{ mr: 1 }} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No TV shows found
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Video Games
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {selectedCharacter.videoGames && selectedCharacter.videoGames.length > 0 ? (
              <List dense>
                {selectedCharacter.videoGames.map((game) => (
                  <ListItem key={`${selectedCharacter._id}-game-${game}`}>
                    <Chip label={game} color="secondary" sx={{ mr: 1 }} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No video games found
              </Typography>
            )}
          </Grid>

          {selectedCharacter.films && selectedCharacter.films.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Films ({selectedCharacter.films.length})
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedCharacter.films.map((film) => (
                  <Chip key={`${selectedCharacter._id}-film-${film}`} label={film} variant="outlined" />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

CharacterModal.displayName = 'CharacterModal';

export default CharacterModal;

