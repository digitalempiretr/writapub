import { useEffect } from 'react'
import { type CarouselApi } from "@/components/ui/carousel"

export const useCarouselSync = (
  api: CarouselApi,
  onSelectCallback: (index: number) => void
) => {
  useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      onSelectCallback(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    onSelect()

    return () => {
      api.off('select', onSelect)
    }
  }, [api, onSelectCallback])
}
