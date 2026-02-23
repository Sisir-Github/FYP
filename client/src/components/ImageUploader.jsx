import { useMemo } from 'react'

function ImageUploader({ label, multiple = false, value, onChange }) {
  const previews = useMemo(() => {
    if (!value) return []
    const files = Array.isArray(value) ? value : [value]
    return files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
  }, [value])

  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </label>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.target.files || [])
          onChange(multiple ? files : files[0] || null)
        }}
        className="mt-2 block w-full text-sm text-slate-600"
      />
      {previews.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {previews.map((preview) => (
            <img
              key={preview.name}
              src={preview.url}
              alt={preview.name}
              className="h-24 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
