import { useState } from 'react';
import AnchorIcon from '@mui/icons-material/Anchor';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    localStorage.setItem(
      'datamed_auth_preview',
      JSON.stringify({
        username: formData.get('username'),
        remember: formData.get('remember') === 'on',
      }),
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 5, lg: 7 },
          color: 'white',
          background:
            'radial-gradient(circle at 18% 20%, rgba(0, 180, 216, 0.45), transparent 28%), linear-gradient(145deg, #06253D 0%, #0B3B60 58%, #0A516F 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 28,
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 6,
            pointerEvents: 'none',
          }}
        />

        <Stack spacing={1.25} sx={{ position: 'relative' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <HealthAndSafetyIcon />
            </Box>
            <Box>
              <Typography variant="h2">DataMed</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                Quan ly Quan y Lu doan Hai quan
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Stack spacing={3} sx={{ position: 'relative', maxWidth: 560 }}>
          <Chip
            icon={<AnchorIcon />}
            label="He thong nghiep vu Quan y"
            sx={{
              alignSelf: 'flex-start',
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
            }}
          />
          <Typography sx={{ fontSize: { md: 42, lg: 52 }, fontWeight: 700, lineHeight: 1.05 }}>
            Dang nhap an toan cho quy trinh kham, dieu tri va quan ly duoc.
          </Typography>
          <Typography sx={{ maxWidth: 500, color: 'rgba(255,255,255,0.76)', fontSize: 16 }}>
            Giao dien tap trung, ro rang va giam tai thi giac de can bo y te xu ly du lieu chinh xac trong moi ca truc.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
          {['Bao mat JWT', 'Theo doi ton kho', 'Ho tro kham benh'].map((item) => (
            <Box
              key={item}
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 4, md: 6 },
          background:
            'radial-gradient(circle at 85% 15%, rgba(0, 180, 216, 0.14), transparent 30%), #F4F7F9',
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 460,
            p: { xs: 3, sm: 4.5 },
            borderRadius: 4,
            boxShadow: '0 24px 70px rgba(11, 59, 96, 0.14)',
            border: '1px solid rgba(11, 59, 96, 0.08)',
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1.5} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 3,
                  color: 'primary.main',
                  bgcolor: 'rgba(0, 180, 216, 0.12)',
                }}
              >
                <LocalHospitalIcon fontSize="large" />
              </Box>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h1">Dang nhap he thong</Typography>
                <Typography sx={{ mt: 0.75, color: 'text.secondary' }}>
                  Su dung tai khoan duoc cap de truy cap phan mem DataMed.
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.25}>
                <TextField
                  name="username"
                  label="Ten dang nhap"
                  placeholder="Nhap ma quan nhan hoac tai khoan"
                  autoComplete="username"
                  fullWidth
                  required
                />
                <TextField
                  name="password"
                  label="Mat khau"
                  placeholder="Nhap mat khau"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'An mat khau' : 'Hien mat khau'}
                          onClick={() => setShowPassword((value) => !value)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <FormControlLabel
                    control={<Checkbox name="remember" color="secondary" />}
                    label="Ghi nho dang nhap"
                    sx={{ color: 'text.secondary' }}
                  />
                  <Button variant="text" size="small">
                    Quen mat khau?
                  </Button>
                </Stack>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<LockOutlinedIcon />}
                  sx={{
                    py: 1.35,
                    bgcolor: 'primary.main',
                    boxShadow: '0 14px 28px rgba(11, 59, 96, 0.24)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      boxShadow: '0 18px 34px rgba(11, 59, 96, 0.3)',
                    },
                  }}
                >
                  Dang nhap
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(0, 180, 216, 0.08)',
                border: '1px solid rgba(0, 180, 216, 0.16)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Luu y: phien ban giao dien hien tai dang dung xu ly dang nhap mau. Khi ket noi API, form se luu JWT vao LocalStorage hoac Cookies theo cau hinh bao mat.
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
