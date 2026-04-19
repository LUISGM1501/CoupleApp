import imageCompression from 'browser-image-compression'
import { isNative } from './platform'
import { withTimeout } from './async'

const HEIC_EXT = /\.(heic|heif)$/i
const HEIC_MIME = /image\/(heic|heif)/i

export function isHeic(file: File): boolean {
  return HEIC_MIME.test(file.type) || HEIC_EXT.test(file.name)
}

/** Comprime una foto para subir. Usa web worker para no bloquear el hilo principal. */
export async function compressPhoto(file: File): Promise<File> {
  if (isHeic(file) && !isNative()) {
    throw new Error(
      'Las fotos HEIC del iPhone no se pueden procesar en web. Usá la app (APK) o exportá como JPG.',
    )
  }

  const options = {
    maxSizeMB: 1.2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.82,
  }

  const compressed = await withTimeout(imageCompression(file, options), 30_000, 'compresión')
  // rename a jpg
  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([compressed], newName, { type: 'image/jpeg' })
}

/** Foto vía cámara nativa de Capacitor. Maneja HEIC automáticamente. */
export async function takePhotoNative(): Promise<File> {
  if (!isNative()) throw new Error('Cámara nativa solo disponible en la app.')
  const { Camera, CameraResultType } = await import('@capacitor/camera')
  const photo = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    saveToGallery: false,
  })
  const b64 = photo.base64String!
  const blob = await (await fetch(`data:image/jpeg;base64,${b64}`)).blob()
  return new File([blob], `cam-${Date.now()}.jpg`, { type: 'image/jpeg' })
}

/** Selector universal: en nativo usa cámara, en web input file. */
export async function pickPhotos(multiple = true): Promise<File[]> {
  if (isNative()) {
    const f = await takePhotoNative()
    return [f]
  }
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp'
    input.multiple = multiple
    input.onchange = () => resolve(input.files ? Array.from(input.files) : [])
    input.click()
  })
}
