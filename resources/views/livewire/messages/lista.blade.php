<?php

use function Livewire\Volt\{state};
use Livewire\Volt\Component;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Message;
use Livewire\Attributes\On;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use App\Models\Room;

new class extends Component {
    use LivewireAlert;

    public $room;

    public Collection $messages;

    public function mount($room)
    {
        $this->room = $room;
        $this->getMessages();
    }

    #[On('echo:room.{room.id},SendMessage')] 
    public function getMessages(): void
    {
        $this->messages = Message::with('user')
            ->where('room_id', $this->room->id)
            ->latest()
            ->get();
    }

    //#[On('echo:room.{room.id},SendMessage')] 
    public function newMessageAlert(): void
    {
        $this->alert('success', 'Mensaje Recibido');
    }
};
?>

<div class="mt-4 bg-white shadow-sm rounded-lg">
    @foreach ($messages as $message)
        <div class="p-4 d-flex align-items-start" wire:key="{{ $message->id }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="me-3 text-secondary" width="20" height="20" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold text-dark">{{ $message->user->name }}</span>
                        <small class="ms-2 text-muted">{{ $message->created_at->format('j M Y, g:i a') }}</small>
                    </div>
                </div>
                <p class="mt-2 text-dark">{{ $message->message }}</p>
            </div>
        </div>
    @endforeach
</div>
