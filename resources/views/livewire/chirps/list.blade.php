<?php
use App\Models\Chirp;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Volt\Component;
use Livewire\Attributes\On;

new class extends Component {
    //
    public Collection $chirps;
    public function mount(): void
    {
        $this->getChirps();
    }

    #[On('chirp-created')]
    #[On('echo:my-channel,SendRealTimeMessage')]
    public function getChirps(): void
    {
        $this->chirps = Chirp::with('user')
            ->latest()
            ->get();
    }
}; ?>

<div class="mt-4 bg-white shadow-sm rounded-lg">
    @foreach ($chirps as $chirp)
        <div class="p-4 d-flex align-items-start" wire:key="{{ $chirp->id }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="me-3 text-secondary" width="20" height="20" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold text-dark">{{ $chirp->user->name }}</span>
                        <small class="ms-2 text-muted">{{ $chirp->created_at->format('j M Y, g:i a') }}</small>
                    </div>
                </div>
                <p class="mt-2 text-dark">{{ $chirp->message }}</p>
            </div>
        </div>
    @endforeach
</div>
